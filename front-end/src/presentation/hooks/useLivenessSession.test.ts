import { renderHook, act, waitFor } from '@testing-library/react';
import { useLivenessSession } from './useLivenessSession';
import type { ICreateLivenessSessionUseCase } from '@domain/ports/in/ICreateLivenessSessionUseCase';
import type { LivenessSession } from '@domain/entities/LivenessSession';
import { describe, it, expect, vi } from 'vitest';

describe('useLivenessSession', () => {
    const mockSession: LivenessSession = {
        sessionId: 'test-session-id',
        status: 'CREATED',
    };

    const mockCreateLivenessSessionUseCase: ICreateLivenessSessionUseCase = {
        execute: vi.fn(),
    };

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useLivenessSession(mockCreateLivenessSessionUseCase));

        expect(result.current.session).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should create a session successfully', async () => {
        (mockCreateLivenessSessionUseCase.execute as any).mockResolvedValue(mockSession);

        const { result } = renderHook(() => useLivenessSession(mockCreateLivenessSessionUseCase));

        await act(async () => {
            await result.current.createSession();
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.session).toEqual(mockSession);
        expect(result.current.error).toBeNull();
        expect(mockCreateLivenessSessionUseCase.execute).toHaveBeenCalled();
    });

    it('should handle errors when creating a session', async () => {
        const errorMessage = 'Network error';
        (mockCreateLivenessSessionUseCase.execute as any).mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useLivenessSession(mockCreateLivenessSessionUseCase));

        await act(async () => {
            try {
                await result.current.createSession();
            } catch (e) {
                // Expected error
            }
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.session).toBeNull();
        expect(result.current.error).toBe(errorMessage);
    });

    it('should set loading state while creating session', async () => {
        let resolvePromise: (value: LivenessSession) => void;
        const promise = new Promise<LivenessSession>((resolve) => {
            resolvePromise = resolve;
        });

        (mockCreateLivenessSessionUseCase.execute as any).mockReturnValue(promise);

        const { result } = renderHook(() => useLivenessSession(mockCreateLivenessSessionUseCase));

        let createSessionPromise: Promise<any>;
        await act(async () => {
            createSessionPromise = result.current.createSession();
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolvePromise!(mockSession);
            await createSessionPromise;
        });

        expect(result.current.loading).toBe(false);
        expect(result.current.session).toEqual(mockSession);
    });
});
