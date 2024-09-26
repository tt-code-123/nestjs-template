import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserListDto } from './dto/user-list.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async findUserByPhone(phone: string) {
    return this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });
  }

  async getUserList(dto: UserListDto) {
    const { pageCurrent, pageSize } = dto;
    const [data, totalRecords] = await Promise.all([
      this.prismaService.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        skip: (pageCurrent - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.user.count(),
    ]);
    return {
      pageCurrent,
      pageSize,
      totalRecords,
      records: data,
    };
  }
}
