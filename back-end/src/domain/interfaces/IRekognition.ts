export interface IRekognition {
    createLivenessSession(): Promise<any>;
    getSessionResult(sessionId: string): Promise<any>;
}