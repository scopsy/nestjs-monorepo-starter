import { IMemberInvite, MemberRoleEnum, MemberStatusEnum } from '@nest-starter/shared';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../user';

export class MemberEntity {
  _id: string;
  _userId?: string;
  user?: Pick<UserEntity, 'firstName' | '_id' | 'lastName' | 'email'>;
  roles: MemberRoleEnum[];
  invite?: IMemberInvite;
  memberStatus: MemberStatusEnum;
}

export class OrganizationEntity {
  _id?: string;
  name: string;
  logo: string;

  @Exclude({ toPlainOnly: true })
  members?: MemberEntity[];
}
