// Session entity representing a Rekognition Liveness session
export interface LivenessSession {
    sessionId: string;
    status: 'CREATED' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
    createdAt?: Date;
}
