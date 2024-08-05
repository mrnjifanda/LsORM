export class AttributeNotFoundError extends Error {

    constructor(attribute: string, tableName: string) {

        super(`Attribute ${attribute} is not defined in table ${tableName}.`);
        this.name = "AttributeNotFoundError";
    }
}