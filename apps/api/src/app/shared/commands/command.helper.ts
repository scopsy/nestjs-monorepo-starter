import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassType } from 'class-transformer/ClassTransformer';
import { BadRequestException, flatten } from '@nestjs/common';

export class CommandHelper {
  static create<T>(command: ClassType<T>, data: object): T {
    const convertedObject = plainToClass<T, object>(command, {
      ...data,
    });

    const errors = validateSync(convertedObject);
    if (errors?.length) {
      const mappedErrors = flatten(errors.map((item) => Object.values(item.constraints)));
      throw new BadRequestException(mappedErrors);
    }

    return convertedObject;
  }
}
