import { useState, useEffect } from 'react';
import type { AwsCredentialProvider } from "@aws-amplify/ui-react-liveness";
import { FaceLivenessDetectorCore } from "@aws-amplify/ui-react-liveness";
import type { IRekognitionRepository } from '@domain/ports/out/IRekognitionRepository';

export const AwsLiveness = ({
    sessionId,
    rekognitionRepository
}: {
    sessionId: string;
    rekognitionRepository: IRekognitionRepository;
}) => {
    const [credentialsReady, setCredentialsReady] = useState(false);
    const [credentialProvider, setCredentialProvider] = useState<AwsCredentialProvider | null>(null);

    useEffect(() => {
        const fetchCredentials = async () => {
            try {
                const credentials = await rekognitionRepository.getAwsCredentials();

                const provider: AwsCredentialProvider = async () => {
                    return {
                        accessKeyId: credentials.accessKeyId,
                        secretAccessKey: credentials.secretAccessKey,
                        sessionToken: credentials.sessionToken,
                        expiration: credentials.expiration
                    };
                };

                setCredentialProvider(() => provider);
                setCredentialsReady(true);
            } catch (error) {
                console.error('Error fetching AWS credentials:', error);
            }
        };

        fetchCredentials();
    }, [rekognitionRepository]);

    const dictionary = {
        en: null,
        es: {
            photosensitivityWarningHeadingText: 'Queremos cuidarte, ten en cuenta',
            photosensitivityWarningBodyText:
                'Esta comprobación usa efectos visuales que podrían afectar a personas con fotosensibilidad.',
            photosensitivityWarningInfoText:
                'Algunas personas pueden tener convulsiones epilépticas con luces de colores. Ten precaución si tú o alguien de tu familia sufre de epilepsia.',
            goodFitCaptionText: 'Buen ajuste',
            tooFarCaptionText: 'Demasiado lejos',
            hintCenterFaceText: 'Ubica tu cara dentro del óvalo',
            startScreenBeginCheckText: 'Inicia la verificación',
            hintTooFarText: 'Acércate un poco más',
            hintTooCloseText: 'Aléjate un poco',
            hintHoldFaceForFreshnessText: 'Mantén tu cara frente a la cámara',
            waitingCameraPermissionText: 'Esperando permiso de cámara...',
            hintVerifyingText: 'Estamos validando tu información.',
            hintCanNotIdentifyText: 'No podemos identificar tu rostro',
            hintMoveFaceFrontOfCameraText: 'Mueve tu cara frente a la cámara',
            hintConnectingText: '',
            recordingIndicatorText: '',

            multipleFacesHeaderText: 'Detectamos varios rostros',
            multipleFacesMessageText: 'Solo tu rostro debe estar frente a la cámara.',

            serverHeaderText: 'Tenemos un problema técnico',
            serverMessageText: 'No podemos completar la validación en este momento.',
            timeoutHeaderText: 'Tardaste demasiado',
            timeoutMessageText: 'Centra tu cara y llena completamente el óvalo.',
            landscapeHeaderText: 'Gira tu dispositivo',
            landscapeMessageText: 'Coloca tu dispositivo en vertical.',
            portraitMessageText: 'Mantén tu dispositivo en vertical durante toda la validación.',
            tryAgainText: 'Inténtalo nuevamente',
        },
    };

    const language = 'es';

    const awsSuccessResponse = async (type: string) => {
        console.log('awsSuccessresponse... ', type);
        const result = await rekognitionRepository.getSessionResult(sessionId);
        console.log('result... ', result);
        const confidence = result.Confidence;
        console.log('confidence... ', confidence);

    };

    const awsErrorResponse = async (livenessError: any) => {
        console.log('Error de aws liveness... ', livenessError);
        if (livenessError.error) {
            console.log('Error de aws liveness... ', livenessError.error);
        }
    }

    if (!credentialsReady || !credentialProvider) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <p>Cargando credenciales AWS...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '600px', height: '100%' }}>
                <FaceLivenessDetectorCore
                    sessionId={sessionId}
                    region={'us-east-1'}
                    onAnalysisComplete={async () => { awsSuccessResponse('success'); }}
                    onError={async (error) => { awsErrorResponse(error); }}
                    disableStartScreen={false}
                    displayText={dictionary[language]}
                    config={{ credentialProvider }}
                />
            </div>
        </div>
    );
};
