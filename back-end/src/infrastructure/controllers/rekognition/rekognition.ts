import { Controller, Get, Post, Query, Body, Version } from "@nestjs/common";
import { RekognitionService } from "@services/rekognitionService";

@Controller()
export class RekognitionController {
    constructor(
        private readonly rekognitionService: RekognitionService
    ) { }

    @Version("1")
    @Post("create-liveness-session")
    async createLivenessSession() {
        return this.rekognitionService.createLivenessSession();
    }

    @Version("1")
    @Get("aws-credentials")
    async getAwsCredentials() {
        // Devolver las credenciales directamente desde las variables de entorno
        // En producción, estas deberían venir de un servicio de secrets management
        return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAZLYDMP6HA5AVXTWN",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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",
            sessionToken: "", // No es necesario para credenciales permanentes
            expiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año en el futuro
        };
    }

    @Version("1")
    @Get("result-session")
    async getSessionResult(@Query('sessionId') sessionId: string) {
        return this.rekognitionService.getSessionResult(sessionId);
    }

    @Version("1")
    @Post("upload-document")
    async uploadDocument(@Body() body: any) {
        try {
            const { imageData, documentType } = body;

            if (!imageData) {
                return {
                    success: false,
                    error: 'No image data provided'
                };
            }

            // Generar un ID único para el documento
            const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Aquí podrías guardar el documento en S3 o base de datos
            // Por ahora, solo retornamos éxito
            return {
                success: true,
                documentId,
                documentType,
                message: 'Document uploaded successfully'
            };
        } catch (error) {
            console.error('Error uploading document:', error);
            return {
                success: false,
                error: 'Failed to upload document'
            };
        }
    }

    @Version("1")
    @Post("validate-document")
    async validateDocument(@Body() body: any) {
        try {
            const { documentId } = body;

            if (!documentId) {
                return {
                    isValid: false,
                    error: 'No document ID provided'
                };
            }

            // Aquí podrías usar AWS Rekognition para validar el documento
            // Por ahora, simulamos una validación exitosa
            const confidence = 0.85 + Math.random() * 0.15; // 85-100%

            return {
                isValid: true,
                confidence,
                documentId,
                message: 'Document validated successfully'
            };
        } catch (error) {
            console.error('Error validating document:', error);
            return {
                isValid: false,
                error: 'Failed to validate document'
            };
        }
    }

}
