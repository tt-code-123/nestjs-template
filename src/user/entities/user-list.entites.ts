import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';

class UserEntities {
  @ApiProperty({ description: 'ID' })
  id: number;
  @ApiProperty({ description: '用户名称' })
  name: string;
  @ApiProperty({ description: '用户手机号' })
  phone: string;
  @ApiProperty({ description: '用户创建时间' })
  createdAt: string;
  @ApiProperty({ description: '用户修改时间' })
  updatedAt: string;
}

export class UserListEntities extends ApiResponseDto<any> {
  @ApiProperty({ description: 'Data', type: () => UserEntities })
  data: UserEntities;
}
