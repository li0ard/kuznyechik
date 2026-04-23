import { BLOCK_SIZE, Kuznyechik } from "../index.js";
import { cbc_encrypt, cbc_decrypt, type TArg, type TRet } from "@li0ard/gost3413";

/**
 * Encrypts data using Cipher Block Chaining (CBC) mode with the Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 */
export const encryptCBC = (key: TArg<Uint8Array>, data: TArg<Uint8Array>, iv: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return cbc_encrypt(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data, iv);
}

/**
 * Decrypts data using Cipher Block Chaining (CBC) mode with the Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 */
export const decryptCBC = (key: TArg<Uint8Array>, data: TArg<Uint8Array>, iv: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return cbc_decrypt(cipher.decryptBlock.bind(cipher), BLOCK_SIZE, data, iv);
}