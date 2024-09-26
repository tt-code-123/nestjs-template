import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  readonly name: string;
  @ApiProperty({ description: '手机号' })
  @IsMobilePhone('zh-CN')
  readonly phone: string;
  @ApiProperty({ description: '密码' })
  @IsString()
  readonly password: string;
}
