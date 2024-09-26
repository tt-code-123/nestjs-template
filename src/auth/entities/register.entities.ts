import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

class RegisterInfoEntities {
  @ApiProperty({ description: '用户ID', type: Number })
  id: number;
}

export class RegisterEntities extends ApiResponseDto<any> {
  @ApiProperty({ description: '注册用户ID', type: RegisterInfoEntities })
  data: RegisterInfoEntities;
}
