import type { IRekognitionRepository } from '@domain/ports/out/IRekognitionRepository';
import type { LivenessSession } from '@domain/entities/LivenessSession';
import type { AwsCredentials } from '@domain/entities/AwsCredentials';

export class RekognitionHttpRepository implements IRekognitionRepository {
    private readonly baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    async createLivenessSession(): Promise<LivenessSession> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/create-liveness-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('response', response);


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            return {
                sessionId: data.SessionId,
                status: 'CREATED',
                createdAt: new Date(),
            };
        } catch (error) {
            console.error('Error in RekognitionHttpRepository:', error);
            throw error;
        }
    }

    async getLivenessSessionStatus(sessionId: string): Promise<LivenessSession> {
        return {
            sessionId,
            status: 'IN_PROGRESS',
        };
    }

    async getAwsCredentials(): Promise<AwsCredentials> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/aws-credentials`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                accessKeyId: data.accessKeyId,
                secretAccessKey: data.secretAccessKey,
                sessionToken: data.sessionToken,
                expiration: new Date(data.expiration),
            };
        } catch (error) {
            console.error('Error getting AWS credentials:', error);
            throw error;
        }
    }

    async getSessionResult(sessionId: string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/v1/result-session?sessionId=${sessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting AWS credentials:', error);
            throw error;
        }
    }
}
