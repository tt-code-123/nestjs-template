import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import helmet from 'helmet';
import { TransformResponseInterceptor } from './common/interceptor/transform-response.interceptor';

async function bootstrap() {
  const logDirPath = process.env.NODE_ENV !== 'production' ? 'dev' : 'prod';

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.File({
          level: 'error',
          filename: `./logs/${logDirPath}/${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}-error.log`,
          format: format.combine(format.timestamp(), format.json()),
          zippedArchive: false, // don't want to zip our logs
          maxFiles: 30, // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.File({
          level: 'info',
          filename: `./logs/${logDirPath}/${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          zippedArchive: false,
          maxFiles: 30,
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  // 初始化swagger
  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Auth', '用户认证')
    .addTag('User', '用户管理')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('swagger/docs', app, document, {
    jsonDocumentUrl: 'swagger/docs/json',
  });

  // 全局管道
  app.useGlobalPipes(
    // 过滤掉不应由方法处理程序接收的属性
    new ValidationPipe({
      whitelist: true,
      // true: 存在非白名单属性时停止处理请求，并向用户返回错误响应
      forbidNonWhitelisted: true,
    }),
  );

  // 全局拦截器
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // 允许跨域
  app.enableCors();

  // helmet保护你的应用免受一些众所周知的 Web 漏洞的侵害
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port, async () => {
    console.log(`
      🚀 Server ready at: http://localhost:${port}
      🚀 DOCS Server ready at: http://localhost:${port}/swagger/docs
    `);
  });
}
bootstrap();
