import { describe, test, expect } from "bun:test"
import { decryptMGM, encryptMGM } from "../src/"

const key = Buffer.from("8899AABBCCDDEEFF0011223344556677FEDCBA98765432100123456789ABCDEF", "hex")
const ad = Buffer.from("0202020202020202010101010101010104040404040404040303030303030303EA0505050505050505", "hex")
const plaintext = Buffer.from("1122334455667700FFEEDDCCBBAA998800112233445566778899AABBCCEEFF0A112233445566778899AABBCCEEFF0A002233445566778899AABBCCEEFF0A0011AABBCC", "hex")
const encrypted = Buffer.from("A9757B8147956E9055B8A33DE89F42FC8075D2212BF9FD5BD3F7069AADC16B39497AB15915A6BA85936B5D0EA9F6851CC60C14D4D3F883D0AB94420695C76DEB2C7552CF5D656F40C34F5C46E8BB0E29FCDB4C", "hex")

describe("MGM", () => {
    test("Encryption", () => {
        expect(encryptMGM(key, plaintext, plaintext.subarray(0, 16), ad)).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        expect(decryptMGM(key, encrypted, plaintext.subarray(0, 16), ad)).toStrictEqual(plaintext)
    })
})