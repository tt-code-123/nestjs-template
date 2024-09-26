import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserListDto } from './dto/user-list.dto';
import { TransformQueryValuePipe } from 'src/common/pipe/transform-query-value.pipe';
import { UserListEntities } from './entities/user-list.entites';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  @ApiOkResponse({
    description: '用户列表',
    type: UserListEntities,
  })
  async getUserList(
    @Query(
      '',
      new TransformQueryValuePipe({
        transformTypeMap: {
          pageSize: 'Number',
          pageCurrent: 'Number',
        },
      }),
    )
    userListDto: UserListDto,
  ) {
    return await this.userService.getUserList(userListDto);
  }
}
