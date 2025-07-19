import { BLOCK_SIZE, Kuznyechik } from "../";
import { ctr } from "@li0ard/gost3413"

/**
 * Encrypts data using the Counter (CTR) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const encryptCTR = (key: Uint8Array, data: Uint8Array, iv: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key);
    const encrypter = (buf: Uint8Array) => cipher.encryptBlock(buf);
    return ctr(encrypter, BLOCK_SIZE, data, iv);
}

/**
 * Decrypts data using the Counter (CTR) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const decryptCTR = encryptCTR;