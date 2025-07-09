import { describe, test, expect } from "bun:test"
import { decryptOFB, encryptOFB } from "../src"

const key = Buffer.from("8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef", "hex")
const iv = Buffer.from("1234567890abcef0a1b2c3d4e5f0011223344556677889901213141516171819", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa998800112233445566778899aabbcceeff0a112233445566778899aabbcceeff0a002233445566778899aabbcceeff0a0011", "hex")
const encrypted = Buffer.from("81800a59b1842b24ff1f795e897abd95ed5b47a7048cfab48fb521369d9326bf66a257ac3ca0b8b1c80fe7fc10288a13203ebbc066138660a0292243f6903150", "hex")

describe("OFB", () => {
    test("Encryption", () => {
        let result = encryptOFB(key, plaintext, iv)
        expect(result).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        let result = decryptOFB(key, encrypted, iv)
        expect(result).toStrictEqual(plaintext)
    })
})