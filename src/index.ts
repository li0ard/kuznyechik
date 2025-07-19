import { BLOCK_SIZE, KEY_SIZE, L, PI, PI_REV, ROUNDS, CipherError } from "./const";

/** Kuznyechik core class */
export class Kuznyechik {
    private roundKeys: Uint8Array[];
  
    /**
     * Kuznyechik core class
     * @param key Encryption key
     */
    constructor(key: Uint8Array) {
        if (key.length !== KEY_SIZE) throw new CipherError("Invalid key length");
        if (key.every(byte => byte === 0)) throw new CipherError("Invalid key format");

        let iter_constants: Uint8Array[] = Array(32).fill(null).map(() => new Uint8Array(BLOCK_SIZE).fill(0));
        for(let i = 0; i < 32; i++) {
            iter_constants[i][15] = i + 1;
            iter_constants[i] = this.transformL(iter_constants[i]);
        }

        const roundKeys: Uint8Array[] = Array(ROUNDS).fill(null).map(() => new Uint8Array(BLOCK_SIZE));
        roundKeys[0] = key.subarray(0, BLOCK_SIZE);
        roundKeys[1] = key.subarray(BLOCK_SIZE);

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
    public getRoundKeys(): Uint8Array[] {
        return this.roundKeys.slice();
    }

    /**
     * `X`-transformation.
     * 
     * The input of the `X` function is two sequences, and the output of the function is the XOR of these two sequences.
     */
    public transformX(a: Uint8Array, b: Uint8Array): Uint8Array {
        const result = new Uint8Array(BLOCK_SIZE);
        for(let i = 0; i < BLOCK_SIZE; i++) {
            result[i] = a[i] ^ b[i];
        }
        return result;
    }

    
    /**
     * `S`-transformation.
     * 
     * The `S` function is a regular substitution function. 
     * Each byte of the input sequence is replaced by the corresponding byte from
     * the `PI` substitution table.
     */
    public transformS(input: Uint8Array): Uint8Array {
        const result = new Uint8Array(BLOCK_SIZE);
        for(let i = 0; i < BLOCK_SIZE; i++) {
            result[i] = PI[input[i]];
        }
    
        return result;
    }

    /**
     * `Srev`-transformation
     * 
     * The `Srev` function is a regular substitution function. 
     * Each byte of the input sequence is replaced by the corresponding byte from
     * the `PI_REV` substitution table.
     */
    public transformS_rev(input: Uint8Array): Uint8Array {
        const result = new Uint8Array(BLOCK_SIZE);
        for(let i = 0; i < BLOCK_SIZE; i++) {
            result[i] = PI_REV[input[i]];
        }
    
        return result;
    }

    
    /**
     * Performs Galois Field (GF(2)) multiplication.
     * 
     * This method multiplies two bytes in the Galois Field using bitwise operations,
     * applying the irreducible polynomial x^8 + x^7 + x^6 + x + 1 for modular reduction.
     */
    public gfMultiply(a: number, b: number): number {
        let result = 0;
        let high_bit: number;
        
        for(let i = 0; i < 8; i++) {
            if((b & 0b00000001) === 0b00000001) {
                result ^= a;
            }

            high_bit = a & 0b10000000;
            a <<= 1;

            if(high_bit == 0b10000000) {
                a ^= 0b11000011;
            }

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
    public transformR(input: Uint8Array): Uint8Array {
        const result = new Uint8Array(BLOCK_SIZE);
        result.set(input.subarray(0, 15), 1);
        result[0] = input[15];

        let temp = 0;
        for (let i = 0; i < 16; i++) {
            temp ^= this.gfMultiply(result[i], L[i]);
        }

        result[0] = temp;

        return result;
    }

    /**
     * `Rrev`-transformation
     * 
     * Performs a linear transformation on the input block by applying Galois Field multiplication
     * with a predefined linear transformation matrix (`L`) and cyclically shifting bytes.
     */
    public transformR_rev(input: Uint8Array): Uint8Array {
        const result = new Uint8Array(BLOCK_SIZE);
        let temp = 0;
        for (let i = 0; i < BLOCK_SIZE; i++) {
            temp ^= this.gfMultiply(input[i], L[i]);
        }

        result.set(input.subarray(1));
        result[15] = temp;

        return result;
    }

    /**
     * `L`-transformation
     * 
     * Performs a linear transformation on the input block by repeatedly applying the `R`-transformation
     * a fixed number of times (equal to the block size).
     */
    public transformL(input: Uint8Array): Uint8Array {
        let result: Uint8Array = input.slice();
        for(let i = 0; i < BLOCK_SIZE; i++) {
            result = this.transformR(result);
        }

        return result;
    }

    /**
     * `Lrev`-transformation
     * 
     * Performs a linear transformation on the input block by repeatedly applying the `Rrev`-transformation
     * a fixed number of times (equal to the block size).
     */
    public transformL_rev(input: Uint8Array): Uint8Array {
        let result: Uint8Array = input.slice();
        for(let i = 0; i < BLOCK_SIZE; i++) {
            result = this.transformR_rev(result);
        }

        return result;
    }

    
    /**
     * `F`-transformation aka `XSLX`-algorithm
     * 
     * Performs a key transformation using a series of linear and substitution transformations.
     */
    public transformF(in_key1: Uint8Array, in_key2: Uint8Array, iter_constant: Uint8Array): Uint8Array[] {        
        return [
            this.transformX(this.transformL(this.transformS(this.transformX(in_key1, iter_constant))), in_key2),
            in_key1.slice()
        ];
    }

    /**
     * Encrypts single block of data using Kuznyechik encryption algorithm.
     * @param block Block to be encrypted
     * @returns {Uint8Array} Encrypted block
     * @throws {CipherError} Block size is invalid or data is too short
     */
    public encryptBlock(block: Uint8Array): Uint8Array {
        if (block.length === 0 || block.length !== BLOCK_SIZE) throw new CipherError("Invalid block size");

        let currentBlock: Uint8Array = block.slice();
        for (let i = 0; i < 9; i++) {
            currentBlock = this.transformL(this.transformS(this.transformX(this.roundKeys[i], currentBlock)));
        }

        currentBlock = this.transformX(this.roundKeys[9], currentBlock);
        return currentBlock;
    }

    /**
     * Decrypts single block of data using Kuznyechik encryption algorithm.
     * @param block Block to be decrypted
     * @returns {Uint8Array} Decrypted block
     * @throws {CipherError} Block size is invalid or data is too short
     */
    public decryptBlock(block: Uint8Array): Uint8Array {
        if (block.length === 0 || block.length !== BLOCK_SIZE) throw new CipherError("Invalid block size");

        let currentBlock: Uint8Array = block.slice();
        currentBlock = this.transformX(this.roundKeys[9], currentBlock);
        const reversedKeys = this.roundKeys.slice(0, 9).reverse();
        for (let i = 0; i < 9; i++) {
            const key = reversedKeys[i];
            currentBlock = this.transformX(key, this.transformS_rev(this.transformL_rev(currentBlock)));
        }

        return currentBlock;
    }
}

export * from "./const";
export * from "./modes/acpkm";
export * from "./modes/cbc";
export * from "./modes/cfb";
export * from "./modes/ctr";
export * from "./modes/ecb";
export * from "./modes/mac";
export * from "./modes/mgm";
export * from "./modes/ofb";