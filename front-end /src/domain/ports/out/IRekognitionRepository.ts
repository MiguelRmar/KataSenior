import type { LivenessSession } from '@domain/entities/LivenessSession';
import type { AwsCredentials } from '@domain/entities/AwsCredentials';

// Output port - Repository interface for Rekognition operations
export interface IRekognitionRepository {
    createLivenessSession(): Promise<LivenessSession>;
    getLivenessSessionStatus(sessionId: string): Promise<LivenessSession>;
    getAwsCredentials(): Promise<AwsCredentials>;
    getSessionResult(sessionId: string): Promise<any>;
}
