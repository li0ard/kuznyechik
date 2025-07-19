import { BLOCK_SIZE, Kuznyechik } from "../"
import { mac as mac_ } from "@li0ard/gost3413"

/**
 * Compute MAC (CMAC, OMAC1) with Kuznyechik cipher
 * @param key Encryption key
 * @param data Input data
 */
export const mac = (key: Uint8Array, data: Uint8Array): Uint8Array => {
    const cipher = new Kuznyechik(key);
    const encrypter = (buf: Uint8Array) => cipher.encryptBlock(buf);
    return mac_(encrypter, BLOCK_SIZE, data);
}