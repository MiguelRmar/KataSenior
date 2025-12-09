
import CryptoJS from 'crypto-js';

export class EncryptionService {
    // Fixed key/iv for demo. MATCHES BACKEND.
    private readonly key = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012');
    private readonly iv = CryptoJS.enc.Utf8.parse('1234567890123456');

    decrypt(ciphertext: string): any {
        try {
            const decrypted = CryptoJS.AES.decrypt(ciphertext, this.key, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
            if (!decryptedString) return null;
            return JSON.parse(decryptedString);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }
}
