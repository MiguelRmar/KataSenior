import { Controller, Get } from "@nestjs/common";
import { RekognitionService } from "src/application/services/recognitionService";

@Controller()
export class RekognitionController {
    constructor(
        private readonly rekognitionService: RekognitionService
    ) { }

    @Get()
    async credentials() {
        return this.rekognitionService.credentials();
    }

}
