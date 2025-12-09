import { IsNotEmpty, IsString } from "class-validator";

export class HeadersValidator {
    @IsString()
    @IsNotEmpty()
    apiKey: string;
    @IsString()
    @IsNotEmpty()
    channel: string;
    @IsString()
    @IsNotEmpty()
    xname: string;
    @IsString()
    @IsNotEmpty()
    uuid: string;
    @IsString()
    @IsNotEmpty()
    documentNumber: string;
}
