import { Ls } from "./Ls";
import { Schema, Record, TableSchema } from "../types/types";
import { AttributeNotFoundError } from "../errors/AttributeNotFoundError";
import { TableNotFoundError } from "../errors/TableNotFoundError";
import { AttributeBadType } from "../errors/AttributeBadType";

export class LsORM extends Ls {

    private static instance: LsORM;

    private constructor(name: string, storage: Storage, schema: Schema) {

        super(name, storage, schema);
    }

    public static getInstance(name: string, storage: Storage, schema: Schema): LsORM {

        if (!LsORM.instance) LsORM.instance = new LsORM(name, storage, schema);
        return LsORM.instance;
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
        tableSchema.relationships.forEach(relationship => {

            const relatedTable = relationship.relatedTable;
            const foreignKey = relationship.foreignKey;
            const localKey = relationship.localKey || '_id';
    
            if (relationship.type === 'one-to-one') {

                populatedRecord[relatedTable] = this.selectOne(relatedTable, { [foreignKey]: record[localKey] });
            } else if (relationship.type === 'one-to-many') {

                populatedRecord[relatedTable] = this.select(relatedTable, { [foreignKey]: record[localKey] });
            }
        });
    
        return populatedRecord;
    }

    public insert(tableName: string, record: Record): void {

        const tableSettings: TableSchema = this.validateRecord(tableName, record);
        if (tableSettings.autoIncrement) record._id = this.getNextId(tableName);

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

            table.push(record);
        });

        this.saveDatabase();
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
