import { BLOCK_SIZE, Kuznyechik } from "../";
import { ofb } from "@li0ard/gost3413"

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
    const encrypter = (buf: Uint8Array) => cipher.encryptBlock(buf);
    return ofb(encrypter, BLOCK_SIZE, data, iv);
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