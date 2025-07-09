import { BLOCK_SIZE, Kuznyechik } from "../";
import { cfb_encrypt, cfb_decrypt } from "@li0ard/gost3413"

/**
 * Encrypts data using Cipher Feedback (CFB) mode with Kuznyechik cipher
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const encryptCFB = (key: Uint8Array, data: Uint8Array, iv: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key)
    const encrypter = (buf: Uint8Array) => {
        return cipher.encryptBlock(buf)
    }
    return cfb_encrypt(encrypter, BLOCK_SIZE, data, iv)
}

/**
 * Decrypts data using Cipher Feedback (CFB) mode with Kuznyechik cipher
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const decryptCFB = (key: Uint8Array, data: Uint8Array, iv: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key)
    const decrypter = (buf: Uint8Array) => {
        return cipher.encryptBlock(buf)
    }
    return cfb_decrypt(decrypter, BLOCK_SIZE, data, iv)
}