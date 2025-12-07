import type { LivenessSession } from '@domain/entities/LivenessSession';

// Output port - Repository interface for Rekognition operations
export interface IRekognitionRepository {
    createLivenessSession(): Promise<LivenessSession>;
    getLivenessSessionStatus(sessionId: string): Promise<LivenessSession>;
}
