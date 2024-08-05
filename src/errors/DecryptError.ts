export class DecryptError extends Error {

    constructor(e: unknown) {

        super(`Error: ${e}`);
        this.name = "DecryptError";
    }
}