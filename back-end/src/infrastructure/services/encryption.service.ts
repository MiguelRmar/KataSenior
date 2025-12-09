
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    // Fixed key/iv for demo purposes. In production use env vars.
    private readonly key = Buffer.from('12345678901234567890123456789012'); // 32 chars
    private readonly iv = Buffer.from('1234567890123456'); // 16 chars

    encrypt(text: string | object): string {
        const textToEncrypt = typeof text === 'object' ? JSON.stringify(text) : text;
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
}
