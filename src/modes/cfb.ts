import { BLOCK_SIZE, Kuznyechik } from "../index.js";
import { cfb_encrypt, cfb_decrypt, type TArg, type TRet } from "@li0ard/gost3413";

/**
 * Encrypts data using Cipher Feedback (CFB) mode with Kuznyechik cipher
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 */
export const encryptCFB = (key: TArg<Uint8Array>, data: TArg<Uint8Array>, iv: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return cfb_encrypt(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data, iv);
}

/**
 * Decrypts data using Cipher Feedback (CFB) mode with Kuznyechik cipher
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 */
export const decryptCFB = (key: TArg<Uint8Array>, data: TArg<Uint8Array>, iv: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return cfb_decrypt(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data, iv);
}