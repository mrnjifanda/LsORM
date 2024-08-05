import { Record, TableSchema, Schema, Settings, StorageData } from "../types/types";
export declare class Ls {
    protected name: string;
    protected storage: Storage;
    protected schema: Schema;
    private database;
    private cryptData;
    private countTables;
    constructor(name: string, storage: Storage, schema: Schema);
    private get;
    private store;
    private initializeDatabase;
    protected getDatabase(): StorageData;
    protected saveDatabase(): void;
    protected getTable(tableName: string): Record[];
    protected verifyTable(tableName: string): TableSchema | null;
    protected getSettings(): Settings;
    getSchemas(): Schema;
    addTable(tableSchema: TableSchema, save?: boolean): void;
    addTables(newTables: Schema, save?: boolean): void;
}
