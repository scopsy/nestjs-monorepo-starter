import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Organization {
  @Field((type) => ID)
  _id: string;

  @Field({ nullable: true })
  name?: string;
}
