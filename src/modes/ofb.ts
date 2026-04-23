import { BLOCK_SIZE, Kuznyechik } from "../index.js";
import { ofb, type TArg, type TRet } from "@li0ard/gost3413";

/**
 * Encrypts data using the Output Feedback (OFB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 */
export const encryptOFB = (key: TArg<Uint8Array>, data: TArg<Uint8Array>, iv: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return ofb(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data, iv);
}

/**
 * Decrypts data using the Output Feedback (OFB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 */
export const decryptOFB = encryptOFB;