import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MemberStatusEnum } from '@nest-starter/shared';

@ObjectType()
export class Member {
  @Field((type) => ID)
  _id: string;

  @Field()
  _userId: string;

  @Field()
  memberStatus: MemberStatusEnum;
}
