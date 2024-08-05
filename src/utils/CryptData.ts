import * as CryptoJS from 'crypto-js';
import { CryptAndDecrypt } from '../interfaces/CryptAndDecrypt';

export class CryptData implements CryptAndDecrypt {

    private static instance: CryptData;

    private constructor(private SECRET_KEY: string) {}

    public static getInstance(SECRET_KEY: string): CryptData {

        if (!CryptData.instance) CryptData.instance = new CryptData(SECRET_KEY);
        return CryptData.instance;
    }

    private getKey(): string {

        return this.SECRET_KEY;
    }

    public encryptData(data: string): string {

        return CryptoJS.AES.encrypt(data, this.getKey()).toString();
    }

    public decryptData(ciphertext: string): string {

        const bytes = CryptoJS.AES.decrypt(ciphertext, this.getKey());
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}
