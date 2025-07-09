import { describe, test, expect } from "bun:test"
import { decryptCTR_ACPKM, encryptCTR_ACPKM, acpkmDerivation, acpkmDerivationMaster, omac_ACPKM } from "../src"

const key = Buffer.from("8899AABBCCDDEEFF0011223344556677FEDCBA98765432100123456789ABCDEF", "hex")
const iv = Buffer.from("1234567890ABCEF0", "hex")
const plaintext = Buffer.from("1122334455667700FFEEDDCCBBAA998800112233445566778899AABBCCEEFF0A112233445566778899AABBCCEEFF0A002233445566778899AABBCCEEFF0A001133445566778899AABBCCEEFF0A001122445566778899AABBCCEEFF0A001122335566778899AABBCCEEFF0A0011223344", "hex")
const encrypted = Buffer.from("F195D8BEC10ED1DBD57B5FA240BDA1B885EEE733F6A13E5DF33CE4B33C45DEE44BCEEB8F646F4C55001706275E85E800587C4DF568D094393E4834AFD0805046CF30F57686AEECE11CFC6C316B8A896EDFFD07EC813636460C4F3B743423163E6409A9C282FAC8D469D221E7FBD6DE5D", "hex")

describe("CTR-ACPKM", () => {
    test("Derivation", () => {
        let expected1 = Buffer.from("2666ED40AE687811745CA0B448F57A7B390ADB5780307E8E9659AC403AE60C60", "hex")
        let expected2 = Buffer.from("BB3DD5402E999B7A3DEBB0DB45448EC530F07365DFEE3ABA8415F77AC8F34CE8", "hex")
        let expected3 = Buffer.from("23362FD553CAD2178299A5B5A2D4722E3BB83C730A8BF57CE2DD004017F8C565", "hex")

        let result1 = acpkmDerivation(key)
        let result2 = acpkmDerivation(result1)
        let result3 = acpkmDerivation(result2)

        expect(result1).toStrictEqual(expected1)
        expect(result2).toStrictEqual(expected2)
        expect(result3).toStrictEqual(expected3)
    })
    test("Encryption", () => {
        let result = encryptCTR_ACPKM(key, plaintext, iv)
        expect(result).toStrictEqual(encrypted)
    })

    test("Decryption", () => {
        let result = decryptCTR_ACPKM(key, encrypted, iv)
        expect(result).toStrictEqual(plaintext)
    })
})

describe("OMAC-ACPKM", () => {
    let expected = Buffer.from("0CABF1F2EFBC4AC16048DF1A24C605B2C0D1673D7586A8EC0DD42C45A4F95BAE0F2E2617E47148680FC3E6178DF2C137C9DDA89CFFA491FEADD9B3EAB703BB31BC7E927F0494729F51B49D3DF9C9460800FBBCF5EDEE610EA02F01093C7BC742D7D6271501B177775263C2A3495A8318A81C79A04F29660EA3FDA874C630799E142C577914FEA90D3BC2502E833685D9", "hex")
    test("Derivation", () => {
        let result = acpkmDerivationMaster(key, 1)
        expect(result).toStrictEqual(expected.subarray(0, 48))
    })

    test("Derivation #2", () => {
        let result = acpkmDerivationMaster(key, 3)
        expect(result).toStrictEqual(expected)
    })

    test("Compute", () => {
        let data = Buffer.from("1122334455667700FFEEDDCCBBAA99880011223344556677", "hex")
        let expected = Buffer.from("B5367F47B62B995EEB2A648C5843145E", "hex")
        let result = omac_ACPKM(key, data)
        expect(result).toStrictEqual(expected)
    })

    test("Compute #2", () => {
        let data = Buffer.from("1122334455667700FFEEDDCCBBAA998800112233445566778899AABBCCEEFF0A112233445566778899AABBCCEEFF0A002233445566778899AABBCCEEFF0A001133445566778899AABBCCEEFF0A001122", "hex")
        let expected = Buffer.from("FBB8DCEE45BEA67C35F58C5700898E5D", "hex")
        let result = omac_ACPKM(key, data)
        expect(result).toStrictEqual(expected)
    })
})