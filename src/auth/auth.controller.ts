import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from 'src/common/decorator/skipAuth.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterEntities } from './entities/register.entities';
import { LoginEntities } from './entities/login.entities';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Post('login')
  @ApiOkResponse({
    description: 'token',
    type: LoginEntities,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @SkipAuth()
  @Post('register')
  @ApiOkResponse({
    description: '用户ID',
    type: RegisterEntities,
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
