import { useState } from 'react';
import type { ICreateLivenessSessionUseCase } from '@domain/ports/in/ICreateLivenessSessionUseCase';
import type { LivenessSession } from '@domain/entities/LivenessSession';

// Custom React hook for liveness session management
export const useLivenessSession = (createLivenessSessionUseCase: ICreateLivenessSessionUseCase) => {
    const [session, setSession] = useState<LivenessSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createSession = async () => {
        setLoading(true);
        setError(null);

        try {
            const newSession = await createLivenessSessionUseCase.execute();
            setSession(newSession);
            return newSession;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        session,
        loading,
        error,
        createSession,
    };
};
