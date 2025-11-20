import { BLOCK_SIZE, Kuznyechik } from "../index.js";
import { ofb } from "@li0ard/gost3413";

/**
 * Encrypts data using the Output Feedback (OFB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const encryptOFB = (key: Uint8Array, data: Uint8Array, iv: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key);
    return ofb(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data, iv);
}

/**
 * Decrypts data using the Output Feedback (OFB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const decryptOFB = encryptOFB;