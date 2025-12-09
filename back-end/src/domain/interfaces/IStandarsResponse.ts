
export interface StandardResponse<T = any> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
}