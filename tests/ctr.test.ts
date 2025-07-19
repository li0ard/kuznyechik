import { describe, test, expect } from "bun:test"
import { decryptCTR, encryptCTR } from "../src"

const key = Buffer.from("8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef", "hex")
const iv = Buffer.from("1234567890abcef0a1b2c3d4e5f0011223344556677889901213141516171819", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa998800112233445566778899aabbcceeff0a112233445566778899aabbcceeff0a002233445566778899aabbcceeff0a0011", "hex")
const encrypted = Buffer.from("f195d8bec10ed1dbd57b5fa240bda1b885eee733f6a13e5df33ce4b33c45dee4a5eae88be6356ed3d5e877f13564a3a5cb91fab1f20cbab6d1c6d15820bdba73", "hex")

describe("CTR", () => {
    test("Encryption", () => {
        expect(encryptCTR(key, plaintext, iv.subarray(0, 8))).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        expect(decryptCTR(key, encrypted, iv.subarray(0, 8))).toStrictEqual(plaintext)
    })
})