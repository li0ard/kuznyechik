import { describe, test, expect } from "bun:test";
import { kexp15, kimp15 } from "../src/";

const key = Buffer.from("8899AABBCCDDEEFF0011223344556677FEDCBA98765432100123456789ABCDEF", "hex");
const keyEnc = Buffer.from("202122232425262728292A2B2C2D2E2F38393A3B3C3D3E3F3031323334353637", "hex");
const keyMac = Buffer.from("08090A0B0C0D0E0F0001020304050607101112131415161718191A1B1C1D1E1F", "hex");
const iv = Buffer.from("0909472DD9F26BE8", "hex");
const kexp = Buffer.from("E36184E84E8D736FF36CC2E5AE065DC656B23C20F549B02FDFF88E1F3F30D8C29A53F3CA554DBAD80DE152B9A4625B32", "hex");

describe("KExp/KImp", () => {
    test("KExp15", () => {
        expect(kexp15(key, keyEnc, keyMac, iv)).toStrictEqual(kexp);
    })
    test("KImp15", () => {
        expect(kimp15(kexp, keyEnc, keyMac, iv)).toStrictEqual(key);
    })
})