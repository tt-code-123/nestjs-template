import {
  OnModuleInit,
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  [x: string]: any;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const prismaClient = this;

    Object.assign(
      this,
      this.$extends({
        name: 'deletedAt',
        query: {
          $allModels: {
            $allOperations(params) {
              const { operation, args, query, model } = params;
              switch (operation) {
                // 查询的时候排除所有被软删除的
                case 'count':
                case 'findUniqueOrThrow':
                case 'findUnique':
                case 'findMany':
                case 'findFirstOrThrow':
                case 'findFirst': {
                  // 视图表
                  args.where = {
                    ...args.where,
                    deletedAt: null,
                  };

                  return query(args);
                }

                case 'delete': {
                  args['data'] = { deletedAt: new Date() };
                  return prismaClient[model].update(args);
                }

                case 'deleteMany': {
                  if (args['data'] !== undefined) {
                    args['data']['deletedAt'] = new Date();
                  } else {
                    args['data'] = { deletedAt: new Date() };
                  }
                  return prismaClient[model].updateMany(args);
                }

                default: {
                  return query(args);
                }
              }
            },
          },
        },
      }),
    );

    // this.$use(this.categoryFindMiddleware)

    // 来源：https://wanago.io/2023/06/19/api-nestjs-prisma-logging/
    this.$on('error', ({ message }) => {
      this.logger.error(message);
    });
    this.$on('warn', ({ message }) => {
      this.logger.warn(message);
    });
    this.$on('info', ({ message }) => {
      this.logger.debug(message);
    });
    this.$on('query', ({ query, params }) => {
      this.logger.log(`query  --->  ${query}; params  --->  ${params}`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
