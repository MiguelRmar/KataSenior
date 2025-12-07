import { IRekognition } from "src/domain/interfaces/IRekognition";

export class RekognitionService implements IRekognition {
    credentials(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
