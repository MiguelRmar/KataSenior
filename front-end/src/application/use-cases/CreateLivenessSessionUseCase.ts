import type { ICreateLivenessSessionUseCase } from '@domain/ports/in/ICreateLivenessSessionUseCase';
import type { IRekognitionRepository } from '@domain/ports/out/IRekognitionRepository';
import type { LivenessSession } from '@domain/entities/LivenessSession';

export class CreateLivenessSessionUseCase implements ICreateLivenessSessionUseCase {
    private rekognitionRepository: IRekognitionRepository;

    constructor(rekognitionRepository: IRekognitionRepository) {
        this.rekognitionRepository = rekognitionRepository;
    }

    async execute(): Promise<LivenessSession> {
        try {
            const session = await this.rekognitionRepository.createLivenessSession();
            console.log('Liveness session created:', session);
            return session;
        } catch (error) {
            console.error('Error creating liveness session:', error);
            throw new Error('Failed to create liveness session');
        }
    }
}
