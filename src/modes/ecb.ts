import { Kuznyechik, BLOCK_SIZE } from "../index.js";
import { ecb_encrypt, ecb_decrypt } from "@li0ard/gost3413";

/**
 * Encrypts data using Electronic Codebook (ECB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @returns {Uint8Array}
 */
export const encryptECB = (key: Uint8Array, data: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key);
    return ecb_encrypt(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data);
}

/**
 * Decrypts data using Electronic Codebook (ECB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @returns {Uint8Array}
 */
export const decryptECB = (key: Uint8Array, data: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key);
    return ecb_decrypt(cipher.decryptBlock.bind(cipher), BLOCK_SIZE, data);
}