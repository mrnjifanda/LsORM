export class TableNotFoundError extends Error {

    constructor(tableName: string) {

        super(`Table ${tableName} does not exist.`);
        this.name = "TableNotFoundError";
    }
}