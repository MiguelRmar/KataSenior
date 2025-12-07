import { Controller, Get, Version } from "@nestjs/common";
import { RekognitionService } from "src/application/services/recognitionService";

@Controller()
export class RekognitionController {
    constructor(
        private readonly rekognitionService: RekognitionService
    ) { }

    @Version("1")
    @Get("create-liveness-session")
    async createLivenessSession() {
        return this.rekognitionService.createLivenessSession();
    }

}
