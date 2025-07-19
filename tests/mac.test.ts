import { test, expect } from "bun:test"
import { mac } from "../src"

const key = Buffer.from("8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa998800112233445566778899aabbcceeff0a112233445566778899aabbcceeff0a002233445566778899aabbcceeff0a0011", "hex")
const computed = Buffer.from("336f4d296059fbe34ddeb35b37749c67", "hex")

test("MAC", () => {
    expect(mac(key, plaintext)).toStrictEqual(computed)
})