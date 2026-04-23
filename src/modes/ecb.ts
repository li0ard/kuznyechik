import { Kuznyechik, BLOCK_SIZE } from "../index.js";
import { ecb_encrypt, ecb_decrypt, type TArg, type TRet } from "@li0ard/gost3413";

/**
 * Encrypts data using Electronic Codebook (ECB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be encrypted
 */
export const encryptECB = (key: TArg<Uint8Array>, data: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return ecb_encrypt(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data);
}

/**
 * Decrypts data using Electronic Codebook (ECB) mode with Kuznyechik cipher.
 * 
 * @param key Encryption key
 * @param data Data to be decrypted
 */
export const decryptECB = (key: TArg<Uint8Array>, data: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return ecb_decrypt(cipher.decryptBlock.bind(cipher), BLOCK_SIZE, data);
}