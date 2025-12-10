
import { EncryptionService } from '../../services/EncryptionService';

export class AuthHttpRepository {
    private readonly baseUrl: string;
    private readonly encryptionService: EncryptionService;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.encryptionService = new EncryptionService();
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': '123456',
                    'channel': 'web',
                    'xname': 'kata-antigravity',
                    'uuid': this.generateUUID(),
                    'document-number': '123456789', // Default or passed as argument
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Login failed'
                };
            }

            if (data.success && data.data) {
                const decryptedData = typeof data.data === 'string'
                    ? this.encryptionService.decrypt(data.data)
                    : data.data;

                if (decryptedData && decryptedData.access_token) {
                    console.log('[Frontend] Login successful. New token:', decryptedData.access_token.substring(0, 10) + '...');
                    return {
                        success: true,
                        token: decryptedData.access_token
                    };
                } else {
                    console.error('[Frontend] Login response decrypted but missing access_token', decryptedData);
                }
            } else {
                console.error('[Frontend] Login failed or unexpected format:', data);
            }

            return {
                success: false,
                error: 'Invalid response format'
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Network error'
            };
        }
    }
}
