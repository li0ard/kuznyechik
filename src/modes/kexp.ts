import { BLOCK_SIZE, Kuznyechik } from "../index.js";
import { kexp15 as kexp15_, kimp15 as kimp15_ } from "@li0ard/gost3413";

/**
 * KExp15 key exporting
 * @param key Key to export
 * @param keyEnc Key for key encryption
 * @param keyMac Key for key authentication
 * @param iv Initialization vector (Half of block size)
 */
export const kexp15 = (key: Uint8Array, keyEnc: Uint8Array, keyMac: Uint8Array, iv: Uint8Array): Uint8Array => {
    const keyCipher = new Kuznyechik(keyEnc);
    const macCipher = new Kuznyechik(keyMac);

    return kexp15_(keyCipher.encryptBlock.bind(keyCipher), macCipher.encryptBlock.bind(macCipher), BLOCK_SIZE, key, iv);
}

/**
 * KImp15 key importing
 * @param kexp Key to import
 * @param keyEnc Key for key decryption
 * @param keyMac Key for key authentication
 * @param iv Initialization vector (Half of block size)
 */
export const kimp15 = (kexp: Uint8Array, keyEnc: Uint8Array, keyMac: Uint8Array, iv: Uint8Array): Uint8Array => {
    const keyCipher = new Kuznyechik(keyEnc);
    const macCipher = new Kuznyechik(keyMac);

    return kimp15_(keyCipher.encryptBlock.bind(keyCipher), macCipher.encryptBlock.bind(macCipher), BLOCK_SIZE, kexp, iv);
}