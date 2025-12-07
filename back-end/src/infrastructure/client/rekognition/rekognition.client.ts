import { RekognitionClient } from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIA37D72AZX25PEXZZB",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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"
    }
});

export { rekognitionClient };