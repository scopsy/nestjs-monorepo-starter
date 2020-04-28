import { SetMetadata } from '@nestjs/common';
import { MemberRoleEnum } from '@nest-starter/shared';

export const Roles = (...roles: MemberRoleEnum[]) => SetMetadata('roles', roles);
