import { CryptAndDecrypt } from '../interfaces/CryptAndDecrypt';
export declare class CryptData implements CryptAndDecrypt {
    private SECRET_KEY;
    private static instance;
    private constructor();
    static getInstance(SECRET_KEY: string): CryptData;
    private getKey;
    encryptData(data: string): string;
    decryptData(ciphertext: string): string;
}
