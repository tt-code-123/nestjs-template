import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class PageInputDto {
  @ApiProperty({ description: '当前第几页' })
  @IsNumberString()
  pageCurrent: number;

  @ApiProperty({ description: '每页多少个' })
  @IsNumberString()
  pageSize: number;
}

export class PageOutDto {
  @ApiProperty({ description: '当前第几页' })
  pageCurrent: number;

  @ApiProperty({ description: '每页多少个' })
  pageSize: number;

  @ApiProperty({ description: '总记录数' })
  totalRecords: number;
}
