import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

export class CommandHelper {
  static create<T>(command: ClassType<T>, data: object): T {
    return plainToClass<T, object>(command, {
      ...data,
    });
  }
}
