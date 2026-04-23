import { xor, type TArg, type TRet } from "@li0ard/gost3413";
import { BLOCK_SIZE, KEY_SIZE, L, PI, PI_REV, ROUNDS } from "./const.js";

/** Kuznyechik core class */
export class Kuznyechik {
    private roundKeys: Uint8Array[];
  
    /**
     * Kuznyechik core class
     * @param key Encryption key
     */
    constructor(key: TArg<Uint8Array>) {
        if (key.length !== KEY_SIZE) throw new Error("Invalid key length");
        if (key.every(byte => byte === 0)) throw new Error("Invalid key format");

        let iter_constants: Uint8Array[] = Array(32).fill(null).map(() => new Uint8Array(BLOCK_SIZE).fill(0));
        for(let i = 0; i < 32; i++) {
            iter_constants[i][15] = i + 1;
            iter_constants[i] = this.transformL(iter_constants[i]);
        }

        const roundKeys: Uint8Array[] = Array(ROUNDS).fill(null).map(() => new Uint8Array(BLOCK_SIZE));
        roundKeys[0] = key.slice(0, BLOCK_SIZE);
        roundKeys[1] = key.slice(BLOCK_SIZE);

        let temp1: Uint8Array = roundKeys[0].slice();
        let temp2: Uint8Array = roundKeys[1].slice();
        let temp3: Uint8Array = new Uint8Array(16);
        let temp4: Uint8Array = new Uint8Array(16);

        for (let i = 0; i < 4; i++) {
            const baseIndex = i * 8;
        
            let res = this.transformF(temp1, temp2, iter_constants[baseIndex]);
            temp3 = res[0];
            temp4 = res[1];
        
            res = this.transformF(temp3, temp4, iter_constants[baseIndex + 1]);
            temp1 = res[0];
            temp2 = res[1];
        
            res = this.transformF(temp1, temp2, iter_constants[baseIndex + 2]);
            temp3 = res[0];
            temp4 = res[1];
        
            res = this.transformF(temp3, temp4, iter_constants[baseIndex + 3]);
            temp1 = res[0];
            temp2 = res[1];
        
            res = this.transformF(temp1, temp2, iter_constants[baseIndex + 4]);
            temp3 = res[0];
            temp4 = res[1];
        
            res = this.transformF(temp3, temp4, iter_constants[baseIndex + 5]);
            temp1 = res[0];
            temp2 = res[1];
        
            res = this.transformF(temp1, temp2, iter_constants[baseIndex + 6]);
            temp3 = res[0];
            temp4 = res[1];
        
            res = this.transformF(temp3, temp4, iter_constants[baseIndex + 7]);
            temp1 = res[0];
            temp2 = res[1];
        
            roundKeys[2 + 2 * i] = new Uint8Array(temp1);
            roundKeys[3 + 2 * i] = new Uint8Array(temp2);
        }

        this.roundKeys = roundKeys;
    }

    /**
     * Returns round keys 
     */
    public getRoundKeys(): Uint8Array[] { return this.roundKeys; }
    
    /**
     * `S`-transformation.
     * 
     * The `S` function is a regular substitution function. 
     * Each byte of the input sequence is replaced by the corresponding byte from
     * the `PI` substitution table.
     */
    private transformS(input: TArg<Uint8Array>): TRet<Uint8Array> {
        const result = new Uint8Array(BLOCK_SIZE);
        for(let i = 0; i < BLOCK_SIZE; i++) result[i] = PI[input[i]];
    
        return result;
    }

    /**
     * `Srev`-transformation
     * 
     * The `Srev` function is a regular substitution function. 
     * Each byte of the input sequence is replaced by the corresponding byte from
     * the `PI_REV` substitution table.
     */
    private transformS_rev(input: TArg<Uint8Array>): TRet<Uint8Array> {
        const result = new Uint8Array(BLOCK_SIZE);
        for(let i = 0; i < BLOCK_SIZE; i++) result[i] = PI_REV[input[i]];
    
        return result;
    }

    
    /**
     * Performs Galois Field (GF(2)) multiplication.
     * 
     * This method multiplies two bytes in the Galois Field using bitwise operations,
     * applying the irreducible polynomial x^8 + x^7 + x^6 + x + 1 for modular reduction.
     */
    private gfMultiply(a: number, b: number): number {
        let result = 0;
        let high_bit: number;
        
        for(let i = 0; i < 8; i++) {
            if((b & 0b00000001) === 0b00000001) result ^= a;
            high_bit = a & 0b10000000;
            a <<= 1;
            if(high_bit == 0b10000000) a ^= 0b11000011;
            b >>= 1;
        }

        return result & 0xFF;
    }

    /**
     * `R`-transformation
     * 
     * Performs a linear transformation on the input block by cyclically shifting bytes
     * and applying Galois Field multiplication with a predefined linear transformation matrix (`L`).
     */
    private transformR(input: TArg<Uint8Array>): TRet<Uint8Array> {
        const result = new Uint8Array(BLOCK_SIZE);
        result.set(input.slice(0, 15), 1);
        result[0] = input[15];

        let temp = 0;
        for (let i = 0; i < 16; i++) temp ^= this.gfMultiply(result[i], L[i]);
        result[0] = temp;

        return result;
    }

    /**
     * `Rrev`-transformation
     * 
     * Performs a linear transformation on the input block by applying Galois Field multiplication
     * with a predefined linear transformation matrix (`L`) and cyclically shifting bytes.
     */
    private transformR_rev(input: TArg<Uint8Array>): TRet<Uint8Array> {
        const result = new Uint8Array(BLOCK_SIZE);
        let temp = 0;
        for (let i = 0; i < BLOCK_SIZE; i++) temp ^= this.gfMultiply(input[i], L[i]);

        result.set(input.slice(1));
        result[15] = temp;

        return result;
    }

    /**
     * `L`-transformation
     * 
     * Performs a linear transformation on the input block by repeatedly applying the `R`-transformation
     * a fixed number of times (equal to the block size).
     */
    private transformL(input: TArg<Uint8Array>): TRet<Uint8Array> {
        let result: Uint8Array = input.slice();
        for(let i = 0; i < BLOCK_SIZE; i++) result = this.transformR(result);

        return result as TRet<Uint8Array>;
    }

    /**
     * `Lrev`-transformation
     * 
     * Performs a linear transformation on the input block by repeatedly applying the `Rrev`-transformation
     * a fixed number of times (equal to the block size).
     */
    private transformL_rev(input: TArg<Uint8Array>): TRet<Uint8Array> {
        let result: Uint8Array = input.slice();
        for(let i = 0; i < BLOCK_SIZE; i++) result = this.transformR_rev(result);

        return result as TRet<Uint8Array>;
    }

    
    /**
     * `F`-transformation aka `XSLX`-algorithm
     * 
     * Performs a key transformation using a series of linear and substitution transformations.
     */
    private transformF(in_key1: TArg<Uint8Array>, in_key2: TArg<Uint8Array>, iter_constant: TArg<Uint8Array>): Uint8Array[] {
        return [
            xor(this.transformL(this.transformS(xor(in_key1, iter_constant))), in_key2),
            in_key1.slice()
        ];
    }

    /**
     * Encrypts single block of data using Kuznyechik encryption algorithm.
     * @param block Block to be encrypted
     */
    public encryptBlock(block: TArg<Uint8Array>): TRet<Uint8Array> {
        if (block.length === 0 || block.length !== BLOCK_SIZE) throw new Error("Invalid block size");
        let currentBlock: Uint8Array = block.slice();
        for (let i = 0; i < 9; i++) currentBlock = this.transformL(this.transformS(xor(this.roundKeys[i], currentBlock)));

        currentBlock = xor(this.roundKeys[9], currentBlock);
        return currentBlock as TRet<Uint8Array>;
    }

    /**
     * Decrypts single block of data using Kuznyechik encryption algorithm.
     * @param block Block to be decrypted
     */
    public decryptBlock(block: TArg<Uint8Array>): TRet<Uint8Array> {
        if (block.length === 0 || block.length !== BLOCK_SIZE) throw new Error("Invalid block size");

        let currentBlock: Uint8Array = block.slice();
        currentBlock = xor(this.roundKeys[9], currentBlock);
        const reversedKeys = this.roundKeys.slice(0, 9).reverse();
        for (let i = 0; i < 9; i++) {
            const key = reversedKeys[i];
            currentBlock = xor(key, this.transformS_rev(this.transformL_rev(currentBlock)));
        }

        return currentBlock as TRet<Uint8Array>;
    }
}

export * from "./const.js";
export * from "./modes/acpkm.js";
export * from "./modes/cbc.js";
export * from "./modes/cfb.js";
export * from "./modes/ctr.js";
export * from "./modes/ecb.js";
export * from "./modes/mac.js";
export * from "./modes/mgm.js";
export * from "./modes/ofb.js";
export * from "./modes/kexp.js";