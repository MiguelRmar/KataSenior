import type { AwsCredentialProvider } from "@aws-amplify/ui-react-liveness";
import { FaceLivenessDetectorCore } from "@aws-amplify/ui-react-liveness";

export const AwsLiveness = ({ sessionId }: { sessionId: string }) => {
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

    const credentialProvider: AwsCredentialProvider = async () => {
        return {
            accessKeyId: "",
            secretAccessKey: "",
            sessionToken: "",
            expiration: new Date()
        };
    };

    const awsSuccessresponse = (type: string) => {
        console.log('awsSuccessresponse... ', type);
    };

    const awsErrorresponse = (livenessError: any) => {
        console.log('Error de aws liveness... ', livenessError);
        if (livenessError.error) {
            console.log('Error de aws liveness... ', livenessError.error);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '600px', height: '100%' }}>
                <FaceLivenessDetectorCore
                    sessionId={sessionId}
                    region={'us-east-1'}
                    onAnalysisComplete={async () => { awsSuccessresponse('success'); }}
                    onError={async (error) => { awsErrorresponse(error); }}
                    disableStartScreen={false}
                    displayText={dictionary[language]}
                    config={{ credentialProvider }}
                />
            </div>
        </div>
    );
};
