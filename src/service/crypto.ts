import { injectable } from "springtype/core/di";
import * as sodium from "libsodium-wrappers";

/**
 * Implements secure hashing and secure symmetric encryption/decryption
 * using libsodium.js (using a WebAssembly wrapper of libsodium).
 * 
 * API usage is trivial and could look like (in SpringType):
 * 
 * class ChecksumService {
 * 
 *     @inject(CryptoService)
 *     cryptoService: CryptoService;
 * 
 *     isEqual(a: string, b: string): boolean {
 *         return this.cryptoService.hash(a) === this.cryptoService.hash(b);
 *     }
 * }
 */
@injectable
export class CryptoService {

    /**
     * Secure hashing
     * @param token Arbitrary string to be hashed
     */
    hash(token: string, length: number = 64) {
        const hash = sodium.crypto_generichash(length, sodium.from_string(token));
        return sodium.to_hex(hash);
    }

    /**
     * Securely encrypts a payload symmetrically. If payload isn't a string, it is serialized by JSON.stringify();
     * The key must be hexadecimal. In case it is not, use this.hash() to hash it first.
     * @param payload String or an arbitrary object
     * @param hexKey String of a hexadecimal of arbitrary length
     */
    encrypt(payload: string | any, hexKey: string) {

        if (typeof payload != 'string') {
            payload = JSON.stringify(payload);
        }
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        return nonce.concat(sodium.crypto_secretbox_easy(payload, nonce, hexKey));
    }

    /**
     * Decrypts a previously encrypted payload symmetrically. 
     * @param nonceAndCiphertext Encrypted ciphertext (output of this.encrypt(...))
     * @param hexKey String of a hexadecimal of arbitrary length used as the key when called this.encrypt()
     */
    decrypt(nonceAndCiphertext: string, hexKey: string) {

        if (nonceAndCiphertext.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
            throw "Short message";
        }
        const nonce = nonceAndCiphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
        const ciphertext = nonceAndCiphertext.slice(sodium.crypto_secretbox_NONCEBYTES);

        return sodium.crypto_secretbox_open_easy(ciphertext, nonce, hexKey);
    }
}