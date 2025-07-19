import { describe, test, expect } from "bun:test"
import { decryptECB, encryptECB } from "../src";

const key = Buffer.from("8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa9988", "hex")
const encrypted = Buffer.from("7f679d90bebc24305a468d42b9d4edcd", "hex")

describe("ECB", () => {
    test("Encryption", () => {
        expect(encryptECB(key, plaintext)).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        expect(decryptECB(key, encrypted)).toStrictEqual(plaintext)
    })
})