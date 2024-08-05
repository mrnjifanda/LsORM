export interface CryptAndDecrypt {
    encryptData(data: string): string;
    decryptData(ciphertext: string): string;
}
