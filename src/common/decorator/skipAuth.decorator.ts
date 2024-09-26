import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// 自定义装饰器 跳过鉴权验证
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
