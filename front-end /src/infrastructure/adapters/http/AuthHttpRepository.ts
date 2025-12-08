
export class AuthHttpRepository {
    private readonly baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
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

            // StandardResponse: { statusCode, success, message, data: { access_token } }
            if (data.success && data.data && data.data.access_token) {
                return {
                    success: true,
                    token: data.data.access_token
                };
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
