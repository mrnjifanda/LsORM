import { Record, TableSchema, Schema, Settings, StorageData } from "../types/types";
import { CryptData } from "../utils/CryptData";
import { TableNotFoundError } from "../errors/TableNotFoundError";
import { DecryptError } from "../errors/DecryptError";

export class Ls {
    private database: StorageData;
    private cryptData: CryptData;
    private countTables: number;

    constructor(protected name: string, protected storage: Storage, protected schema: Schema) {

        this.cryptData = CryptData.getInstance('secret-key');
        this.database = this.initializeDatabase(this.schema);
        this.countTables = Object.keys(this.schema).length;
    }

    private get(): StorageData {

        const value = this.storage.getItem(this.name);
        if (value) {

            try {

                const data: string = this.cryptData.decryptData(value);
                return JSON.parse(data);
            } catch (e) {

                console.error("Failed to decrypt data", e);
                throw new DecryptError(e);
            }
        }

        return {
            database: {},
            settings: {
                created_at: new Date().toISOString(),
                schema: {},
                last_id: {},
                init: true
            }
        };
    }

    private store(data: StorageData): void {

        try {

            const parse = JSON.stringify(data);
            const encrypt = this.cryptData.encryptData(parse);
            this.storage.setItem(this.name, encrypt);
        } catch (e) {

            console.error("Failed to encrypt data", e);
        }
    }

    private initializeDatabase(schema: Schema): StorageData {

        this.database = this.get();
        if (this.database.settings.init === false) return this.database;

        this.database.settings.init = false;
        this.addTables(schema, false);
        this.store(this.database);
        return this.database;
    }

    protected getDatabase(): StorageData {

        return this.database;
    }

    protected saveDatabase(): void {

        this.store(this.database);
    }

    protected getTable(tableName: string): Record[] {
        return this.getDatabase().database[tableName] || [];
    }

    protected verifyTable(tableName: string): TableSchema | null {

        return this.getSchemas()[tableName] || null;
    }

    protected getSettings(): Settings {

        return this.getDatabase().settings;
    }

    public getSchemas(): Schema {

        return this.getSettings().schema;
    }

    public addTable(tableSchema: TableSchema, save: boolean = true): void {

        const currentSchema = this.getSchemas();
        const currentDatabase = this.getDatabase().database;
        const tableName = tableSchema.table;

        if (currentSchema[tableName]) throw new TableNotFoundError(tableName);
    
        currentSchema[tableName] = tableSchema;
        currentDatabase[tableName] = [];
        this.getSettings().last_id[tableName] = 0;
    
        if (save) this.saveDatabase();
    }

    public addTables(newTables: Schema, save: boolean = true): void {

        Object.keys(newTables).forEach(tableName => {

            this.addTable(newTables[tableName], save);
        });
    }
}
