import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isNil } from 'lodash';

interface TransformValueOptions {
  defaultValueMap?: Record<string, any>;
  transformTypeMap: Record<string, 'Number' | 'Boolean' | 'String'>;
}

const TypeMap = {
  Number: (val) => {
    return Number(val);
  },
  Boolean: (val) => {
    return Boolean(val);
  },
  String: (val) => {
    return String(val);
  },
};

@Injectable()
export class TransformQueryValuePipe implements PipeTransform<object, any> {
  private options: TransformValueOptions;

  constructor(options: {
    defaultValueMap?: TransformValueOptions['defaultValueMap'];
    transformTypeMap: TransformValueOptions['transformTypeMap'];
  }) {
    this.options = {
      ...options,
      defaultValueMap: options.defaultValueMap || {},
    };
  }

  transform(value: object, metadata: ArgumentMetadata): any {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
      throw new BadRequestException(`Invalid value for ${metadata.data}`);
    }

    const cloneValue = { ...value };
    const { defaultValueMap, transformTypeMap } = this.options;

    for (const key in cloneValue) {
      if (Object.prototype.hasOwnProperty.call(cloneValue, key)) {
        const element = cloneValue[key];
        const type = transformTypeMap[key];
        const defaultValue = defaultValueMap[key];
        cloneValue[key] = isNil(element)
          ? (defaultValue ?? null)
          : (TypeMap[type]?.(element) ?? element);
      }
    }

    return { ...defaultValueMap, ...cloneValue };
  }
}
