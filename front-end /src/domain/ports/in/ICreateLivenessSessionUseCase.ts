import type { LivenessSession } from '@domain/entities/LivenessSession';

// Input port - Use case interface
export interface ICreateLivenessSessionUseCase {
    execute(): Promise<LivenessSession>;
}
