import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

class LoginTokenEntity {
  @ApiProperty({ description: 'Token', type: String })
  access_token: string;
}

export class LoginEntities extends ApiResponseDto<any> {
  @ApiProperty({ description: 'Token', type: LoginTokenEntity })
  data: LoginTokenEntity;
}
