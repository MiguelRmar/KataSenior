export interface IS3 {
    uploadFile(bucketName: string, key: string, fileBody: Buffer | string | ReadableStream, contentType: string): Promise<string>;
}