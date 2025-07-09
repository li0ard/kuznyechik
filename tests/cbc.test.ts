import { describe, test, expect } from "bun:test"
import { decryptCBC, encryptCBC } from "../src"

const key = Buffer.from("8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef", "hex")
const iv = Buffer.from("1234567890abcef0a1b2c3d4e5f0011223344556677889901213141516171819", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa998800112233445566778899aabbcceeff0a112233445566778899aabbcceeff0a002233445566778899aabbcceeff0a0011", "hex")
const encrypted = Buffer.from("689972d4a085fa4d90e52e3d6d7dcc272826e661b478eca6af1e8e448d5ea5acfe7babf1e91999e85640e8b0f49d90d0167688065a895c631a2d9a1560b63970", "hex")

describe("CBC", () => {
    test("Encryption", () => {
        let result = encryptCBC(key, plaintext, iv)
        expect(result).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        let result = decryptCBC(key, encrypted, iv)
        expect(result).toStrictEqual(plaintext)
    })
})