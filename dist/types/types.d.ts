export type AttributeType = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
export interface AttributeSchema {
    readonly type?: AttributeType;
}
export interface Relationship {
    readonly type: RelationshipType;
    readonly relatedTable: string;
    readonly localKey?: string;
    readonly foreignKey?: string;
    readonly pivotTable?: string;
}
export interface TableSchema {
    readonly table: string;
    readonly attributes: {
        [attributeName: string]: AttributeSchema;
    };
    readonly relationships?: Relationship[];
    readonly autoIncrement?: boolean;
}
export interface Schema {
    [tableName: string]: TableSchema;
}
export interface Record {
    [key: string]: any;
}
export interface Database {
    [tableName: string]: Record[];
}
export interface Settings {
    readonly created_at: string;
    readonly schema: Schema;
    readonly last_id: {
        [tableName: string]: number;
    };
    init: boolean;
}
export interface StorageData {
    readonly database: Database;
    readonly settings: Settings;
}
