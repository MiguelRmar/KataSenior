export interface IRekognition {
    createLivenessSession(): Promise<any>;
    getSessionResult(sessionId: string): Promise<any>;
    getAwsCredentials(): Promise<any>;
    detectLabels(bucketName: string, imageKey: string): Promise<any>;
    detectText(bucketName: string, imageKey: string): Promise<any>;
    compareFaces(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string): Promise<any>;
}