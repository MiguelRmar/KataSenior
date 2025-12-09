import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
    @ApiProperty({ description: 'HTTP Status Code', example: 200 })
    statusCode: number;

    @ApiProperty({ description: 'Operation success status', example: true })
    success: boolean;

    @ApiProperty({ description: 'Response message', example: 'Operation successful' })
    message: string;

    data: T;
}
