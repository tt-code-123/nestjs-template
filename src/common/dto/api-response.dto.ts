import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  static dataType: any;
  @ApiProperty({ description: 'Return code' })
  statusCode: number;
  @ApiProperty({ description: 'Message' })
  msg?: string;
  @ApiProperty({ description: 'Data', type: '' })
  data?: T;
}
