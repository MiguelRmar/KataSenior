import { RekognitionClient } from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAZLYDMP6HA5AVXTWN",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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"
    }
});

export { rekognitionClient };