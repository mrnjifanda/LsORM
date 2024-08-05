import { Ls } from "./Ls";
import { Schema, Record } from "../types/types";
export declare class LsORM extends Ls {
    private static instance;
    private constructor();
    static getInstance(name: string, storage: Storage, schema: Schema): LsORM;
    private validateRecord;
    private getNextId;
    private populateRecord;
    insert(tableName: string, record: Record): void;
    insertMany(tableName: string, records: Record[]): void;
    all(tableName: string): Record[];
    select(tableName: string, query?: Record, populate?: boolean): Record[];
    selectOne(tableName: string, query?: Record, populate?: boolean): Record | null;
    update(tableName: string, query: Record, updates: Record): void;
    delete(tableName: string, query: Record): void;
}
