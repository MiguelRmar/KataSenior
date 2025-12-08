import { useLivenessSession } from '@presentation/hooks/useLivenessSession';
import { CreateLivenessSessionUseCase } from '@application/use-cases/CreateLivenessSessionUseCase';
import { RekognitionHttpRepository } from '@infrastructure/adapters/http/RekognitionHttpRepository';
import { AwsLiveness } from '@presentation/pages/AwsLiveness';

// Dependency injection - Create instances
const rekognitionRepository = new RekognitionHttpRepository();
const createLivenessSessionUseCase = new CreateLivenessSessionUseCase(rekognitionRepository);

export const LivenessComponent = ({ onSuccess }: { onSuccess?: (confidence: number, sessionId: string) => void }) => {
    const { session, loading, error, createSession } = useLivenessSession(createLivenessSessionUseCase);

    const handleCreateSession = async () => {
        try {
            await createSession();
        } catch (err) {
            console.error('Failed to create session:', err);
        }
    };

    // Renderizar AwsLiveness cuando hay una sesión activa
    if (session) {
        return <AwsLiveness sessionId={session.sessionId} rekognitionRepository={rekognitionRepository} onSuccess={onSuccess} />;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Prueba de autenticidad</h2>

            <button
                onClick={handleCreateSession}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Iniciando...' : 'Inicia la prueba de autenticidad'}
            </button>

            {error && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
};
