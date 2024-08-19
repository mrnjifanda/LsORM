import { Ls } from "./Ls";
import { Schema, Record, TableSchema } from "../types/types";
import { AttributeNotFoundError } from "../errors/AttributeNotFoundError";
import { TableNotFoundError } from "../errors/TableNotFoundError";
import { AttributeBadType } from "../errors/AttributeBadType";
import { now } from "../utils/Utils";

export class LsWebORM extends Ls {

    private static instance: LsWebORM;

    private constructor(name: string, storage: Storage, schema: Schema) {

        super(name, storage, schema);
    }

    public static getInstance(name: string, storage: Storage, schema: Schema): LsWebORM {

        if (!LsWebORM.instance) LsWebORM.instance = new LsWebORM(name, storage, schema);
        return LsWebORM.instance;
    }

    private validateRecord(tableName: string, record: Record): TableSchema {

        const tableSchema: TableSchema | null = super.verifyTable(tableName);
        if (tableSchema === null) throw new TableNotFoundError(tableName);

        Object.keys(record).forEach(attribute => {

            const attributeSchema = tableSchema.attributes[attribute];
            if (!attributeSchema) throw new AttributeNotFoundError(attribute, tableName);

            if (attributeSchema.type) {

                const expectedType = attributeSchema.type;
                const actualType = Array.isArray(record[attribute]) ? 'array' : typeof record[attribute];
                if (actualType !== expectedType) throw new AttributeBadType(attribute, tableName, expectedType, actualType);
            }
        });

        return tableSchema;
    }

    private getNextId(tableName: string): number {

        const nextId = ++this.getSettings().last_id[tableName];
        this.saveDatabase();
        return nextId;
    }

    private populateRecord(tableName: string, record: Record): Record {

        const tableSchema = this.verifyTable(tableName);
        if (!tableSchema || !tableSchema.relationships) return record;

        const populatedRecord = { ...record };
        const relationships = tableSchema.relationships;
        relationships.forEach(relationship => {

            const relatedTable = relationship.relatedTable;
            const foreignKey = relationship.foreignKey ?? tableName + 'Id';
            const localKey = relationship.localKey ?? '_id';

            switch (relationship.type) {

                case 'one-to-one':

                    populatedRecord[relatedTable] = this.selectOne(relatedTable, { [foreignKey]: record[localKey] });
                    break;
                case 'one-to-many':

                    populatedRecord[relatedTable] = this.select(relatedTable, { [foreignKey]: record[localKey] });
                    break;
                case 'many-to-one':

                    populatedRecord[relatedTable] = this.selectOne(relatedTable, { [localKey]: record[foreignKey] });
                    break;
                case 'many-to-many':

                    const pivotTableName = this.getPivotTableName(tableName, relatedTable);

                    if (!this.verifyTable(pivotTableName)) break;

                    const pivotRecords = this.select(pivotTableName, { [foreignKey]: record[localKey] });
                    populatedRecord[relatedTable] = pivotRecords.map(pivot => this.selectOne(relatedTable, { [localKey]: pivot[relatedTable+'Id'] }));
                    break;
            }
        });

        return populatedRecord;
    }

    private getPivotTableName(tableName: string, relatedTableName: string): string {

        return `${tableName}_${relatedTableName}`;
    }

    public insert(tableName: string, record: Record): void {

        const tableSettings: TableSchema = this.validateRecord(tableName, record);
        if (tableSettings.autoIncrement) record._id = this.getNextId(tableName);
        record._created_at = now();

        const table = this.getTable(tableName);
        table.push(record);
        this.saveDatabase();
    }

    public insertMany(tableName: string, records: Record[]): void {

        const tableSchema: TableSchema | null = super.verifyTable(tableName);
        if (tableSchema === null) throw new TableNotFoundError(tableName);

        const table = this.getTable(tableName);
        records.forEach(record => {

            this.validateRecord(tableName, record);
            if (tableSchema.autoIncrement) record._id = this.getNextId(tableName);
            record._created_at = now();

            table.push(record);
        });

        this.saveDatabase();
    }

    public insertManyToMany(tableName: string, record: Record, relatedTableName: string, relatedIds: number[]): void {

        const tableSchema = this.validateRecord(tableName, record);
        const table = this.getTable(tableName);
        if (tableSchema.autoIncrement) record._id = this.getNextId(tableName);

        table.push(record);
        this.saveDatabase();

        const pivotTableName = this.getPivotTableName(tableName, relatedTableName);
        relatedIds.forEach((relatedId) => {

            this.insert(pivotTableName, {
                [`${tableName}Id`]: record._id,
                [`${relatedTableName}Id`]: relatedId
            });
        });
    }

    public addManyToManyRelation(tableName: string, recordId: number, relatedTableName: string, relatedIds: number[]): void {

        const pivotTableName = this.getPivotTableName(tableName, relatedTableName);
        const pivotTable = this.getTable(pivotTableName);
        relatedIds.forEach((relatedId) => {

            const existingRelation = pivotTable.find((record) =>

                record[`${tableName}Id`] === recordId &&
                record[`${relatedTableName}Id`] === relatedId
            );

            if (!existingRelation) {

                this.insert(pivotTableName, {
                    [`${tableName}_id`]: recordId,
                    [`${relatedTableName}_id`]: relatedId
                });
            }
        });
    }
      
    public all(tableName: string): Record[] {

        if (super.verifyTable(tableName) === null) throw new TableNotFoundError(tableName);

        return this.getTable(tableName);
    }

    public select(tableName: string, query: Record = {}, populate: boolean = false): Record[] {

        if (super.verifyTable(tableName) === null) throw new TableNotFoundError(tableName);

        const records = this.getTable(tableName).filter(record => {

            return Object.keys(query).every(key => record[key] === query[key]);
        });

        return populate ? records.map(record => this.populateRecord(tableName, record)) : records;
    }

    public selectOne(tableName: string, query: Record = {}, populate: boolean = false): Record | null {

        if (super.verifyTable(tableName) === null) throw new TableNotFoundError(tableName);

        const record = this.getTable(tableName).find(record => {

            return Object.keys(query).every(key => record[key] === query[key]);
        });

        if (record && populate) return this.populateRecord(tableName, record);

        return record || null;
    }

    public update(tableName: string, query: Record, updates: Record): void {

        this.validateRecord(tableName, updates);

        const table = this.getTable(tableName);
        const updatedTable = table.map(record => {

            return (Object.keys(query).every(key => record[key] === query[key])) ? { ...record, ...updates } : record;
        });

        this.getDatabase().database[tableName] = updatedTable;
        this.saveDatabase();
    }

    public delete(tableName: string, query: Record): void {

        if (super.verifyTable(tableName) === null) throw new TableNotFoundError(tableName);

        const table = this.getTable(tableName);
        const updatedTable = table.filter(record => {

            return !Object.keys(query).every(key => record[key] === query[key]);
        });

        this.getDatabase().database[tableName] = updatedTable;
        this.saveDatabase();
    }
}
