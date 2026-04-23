import { BLOCK_SIZE, Kuznyechik } from "../index.js"
import { mac as mac_, type TArg, type TRet } from "@li0ard/gost3413";

/**
 * Compute MAC (CMAC/OMAC) with Kuznyechik cipher
 * @param key Encryption key
 * @param data Input data
 */
export const mac = (key: TArg<Uint8Array>, data: TArg<Uint8Array>): TRet<Uint8Array> => {
    const cipher = new Kuznyechik(key);
    return mac_(cipher.encryptBlock.bind(cipher), BLOCK_SIZE, data);
}