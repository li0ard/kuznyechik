import { describe, test, expect } from "bun:test"
import { decryptCFB, encryptCFB } from "../src"

const key = Buffer.from("8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef", "hex")
const iv = Buffer.from("1234567890abcef0a1b2c3d4e5f0011223344556677889901213141516171819", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa998800112233445566778899aabbcceeff0a112233445566778899aabbcceeff0a002233445566778899aabbcceeff0a0011", "hex")
const encrypted = Buffer.from("81800a59b1842b24ff1f795e897abd95ed5b47a7048cfab48fb521369d9326bf79f2a8eb5cc68d38842d264e97a238b54ffebecd4e922de6c75bd9dd44fbf4d1", "hex")

describe("CFB", () => {
    test("Encryption", () => {
        expect(encryptCFB(key, plaintext, iv)).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        expect(decryptCFB(key, encrypted, iv)).toStrictEqual(plaintext)
    })
})