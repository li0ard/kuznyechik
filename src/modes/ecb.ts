import { Kuznyechik, BLOCK_SIZE } from "../";
import { ecb_encrypt, ecb_decrypt } from "@li0ard/gost3413"

/**
 * Encrypts data using Electronic Codebook (ECB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 * @returns {Uint8Array}
 */
export const encryptECB = (key: Uint8Array, data: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key)
    const encrypter = (buf: Uint8Array) => {
        return cipher.encryptBlock(buf)
    }
    return ecb_encrypt(encrypter, BLOCK_SIZE, data)
}

/**
 * Decrypts data using Electronic Codebook (ECB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 * @returns {Uint8Array}
 */
export const decryptECB = (key: Uint8Array, data: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key)
    const decrypter = (buf: Uint8Array) => {
        return cipher.decryptBlock(buf)
    }
    return ecb_decrypt(decrypter, BLOCK_SIZE, data)
}