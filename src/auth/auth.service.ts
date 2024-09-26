import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 15);
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const { phone, password } = dto;
    const user = await this.userService.findUserByPhone(phone);

    if (!user) {
      throw new NotFoundException('手机号或密码错误');
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new NotFoundException('手机号或密码错误');
    }

    const payload = { sub: user.id, name: user.name, phone: user.phone };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: RegisterDto) {
    const oldUser = await this.userService.findUserByPhone(dto.phone);
    if (oldUser) {
      throw new NotAcceptableException('用户已存在');
    }

    const data = {
      ...dto,
    };
    // 加密密码
    if (dto.password) {
      data['password'] = await encryptPassword(dto.password);
    } else {
      throw new NotAcceptableException('请完善参数');
    }

    const user = await this.prismaService.user.create({
      data: data,
    });

    return {
      id: user.id,
    };
  }
}
