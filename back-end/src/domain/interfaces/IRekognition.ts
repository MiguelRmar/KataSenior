export interface IContext {
    uuid?: string;
    documentNumber?: string;
}

export interface IRekognition {
    createLivenessSession(context?: IContext): Promise<any>;
    getSessionResult(sessionId: string, context?: IContext): Promise<any>;
    getAwsCredentials(context?: IContext): Promise<any>;
    detectLabels(bucketName: string, imageKey: string, context?: IContext): Promise<any>;
    detectText(bucketName: string, imageKey: string, context?: IContext): Promise<any>;
    compareFaces(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string, context?: IContext): Promise<any>;
}