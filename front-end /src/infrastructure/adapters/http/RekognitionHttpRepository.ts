import type { IRekognitionRepository } from '@domain/ports/out/IRekognitionRepository';
import type { LivenessSession } from '@domain/entities/LivenessSession';

// Infrastructure adapter - HTTP implementation of Rekognition repository
export class RekognitionHttpRepository implements IRekognitionRepository {
    private readonly baseUrl: string;

    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    async createLivenessSession(): Promise<LivenessSession> {
        try {
            const response = await fetch(`${this.baseUrl}/create-liveness-session`, {
                method: 'GET',
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
        // Placeholder implementation
        return {
            sessionId,
            status: 'IN_PROGRESS',
        };
    }
}
