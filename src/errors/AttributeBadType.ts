export class AttributeBadType extends Error {

    constructor(attribute: string, tableName: string, expectedType: string, actualType: string) {

        super(`Type of attribute ${attribute} in table ${tableName} should be ${expectedType}, but got ${actualType}.`);
        this.name = "AttributeBadType";
    }
}
