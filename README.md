<p align="center">
    <b>@li0ard/kuznyechik</b><br>
    <b>Kuznyechik cipher implementation in pure TypeScript</b>
    <br>
    <a href="https://li0ard.is-cool.dev/kuznyechik">docs</a>
    <br><br>
    <a href="https://github.com/li0ard/kuznyechik/actions/workflows/test.yml"><img src="https://github.com/li0ard/kuznyechik/actions/workflows/test.yml/badge.svg" /></a>
    <a href="https://github.com/li0ard/kuznyechik/blob/main/LICENSE"><img src="https://img.shields.io/github/license/li0ard/kuznyechik" /></a>
    <br>
    <a href="https://npmjs.com/package/@li0ard/kuznyechik"><img src="https://img.shields.io/npm/v/@li0ard/kuznyechik" /></a>
    <a href="https://jsr.io/@li0ard/kuznyechik"><img src="https://jsr.io/badges/@li0ard/kuznyechik" /></a>
    <br>
    <hr>
</p>

> [!WARNING]
> This library is currently in alpha stage: the lib is not very stable yet, and there may be a lot of bugs
> feel free to try it out, though, any feedback is appreciated!

## Installation

```bash
# from NPM
npm i @li0ard/kuznyechik

# from JSR
bunx jsr i @li0ard/kuznyechik
```

## Supported modes
- [x] Electronic Codebook (ECB)
- [x] Cipher Block Chaining (CBC)
- [x] Cipher Feedback (CFB)
- [x] Counter (CTR)
- [x] Output Feedback (OFB)
- [x] MAC (CMAC/OMAC/OMAC1)
- [x] Counter with Advance Cryptographic Prolongation of Key Material (CTR-ACPKM)
- [x] MAC with Advance Cryptographic Prolongation of Key Material (OMAC-ACPKM)
- [x] Multilinear Galois Mode (MGM)

## Features
- Provides simple and modern API
- Most of the APIs are strictly typed
- Fully complies with [GOST R 34.12-2015 (RFC 7801)](https://datatracker.ietf.org/doc/html/rfc7801) and [GOST R 34.13-2015 (in Russian)](https://tc26.ru/standard/gost/GOST_R_3413-2015.pdf) standarts
- Supports Bun, Node.js, Deno, Browsers

## Examples
### ECB mode
```ts
import { decryptECB, encryptECB } from "@li0ard/kuznyechik";

const key = Buffer.from("8899AABBCCDDEEFF0011223344556677FEDCBA98765432100123456789ABCDEF", "hex")
const plaintext = Buffer.from("1122334455667700ffeeddccbbaa9988", "hex")
const encrypted = encryptECB(key, plaintext)
console.log(encrypted) // Uint8Array [ ... ]

const decrypted = decryptECB(key, encrypted)
console.log(decrypted) // Uint8Array [ ... ]
```

### CTR-ACPKM mode
```ts
import { decryptCTR_ACPKM, encryptCTR_ACPKM } from "@li0ard/kuznyechik"

const key = Buffer.from("8899AABBCCDDEEFF0011223344556677FEDCBA98765432100123456789ABCDEF", "hex")
const iv = Buffer.from("1234567890ABCEF0", "hex")
const plaintext = Buffer.from("1122334455667700FFEEDDCCBBAA998800112233445566778899AABBCCEEFF0A112233445566778899AABBCCEEFF0A002233445566778899AABBCCEEFF0A001133445566778899AABBCCEEFF0A001122445566778899AABBCCEEFF0A001122335566778899AABBCCEEFF0A0011223344", "hex")

const encrypted = encryptCTR_ACPKM(key, plaintext, iv)
console.log(encrypted) // Uint8Array [...]

const decrypted = decryptCTR_ACPKM(key, encrypted, iv)
console.log(decrypted) // Uint8Array [...]
```