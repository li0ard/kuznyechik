import { BLOCK_SIZE, Kuznyechik } from "../";
import { cbc_encrypt, cbc_decrypt } from "@li0ard/gost3413"

/**
 * Encrypts data using Cipher Block Chaining (CBC) mode with the Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const encryptCBC = (key: Uint8Array, data: Uint8Array, iv: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key)
    const encrypter = (buf: Uint8Array) => {
        return cipher.encryptBlock(buf)
    }
    return cbc_encrypt(encrypter, BLOCK_SIZE, data, iv)
}

/**
 * Decrypts data using Cipher Block Chaining (CBC) mode with the Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @param iv Initialization vector
 * @returns {Uint8Array}
 */
export const decryptCBC = (key: Uint8Array, data: Uint8Array, iv: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key)
    const decrypter = (buf: Uint8Array) => {
        return cipher.decryptBlock(buf)
    }
    return cbc_decrypt(decrypter, BLOCK_SIZE, data, iv)
}