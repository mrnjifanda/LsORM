import { Ls } from "./Ls";
import { Schema, Record } from "../types/types";
export declare class LsWebORM extends Ls {
    private static instance;
    private constructor();
    static getInstance(name: string, storage: Storage, schema: Schema): LsWebORM;
    private validateRecord;
    private getNextId;
    private populateRecord;
    private getPivotTableName;
    insert(tableName: string, record: Record): void;
    insertMany(tableName: string, records: Record[]): void;
    insertManyToMany(tableName: string, record: Record, relatedTableName: string, relatedIds: number[]): void;
    addManyToManyRelation(tableName: string, recordId: number, relatedTableName: string, relatedIds: number[]): void;
    all(tableName: string): Record[];
    select(tableName: string, query?: Record, populate?: boolean): Record[];
    selectOne(tableName: string, query?: Record, populate?: boolean): Record | null;
    update(tableName: string, query: Record, updates: Record): void;
    delete(tableName: string, query: Record): void;
}
