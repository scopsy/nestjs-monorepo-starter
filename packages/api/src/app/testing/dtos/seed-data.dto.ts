import { IsBoolean, IsNumber } from 'class-validator';
import { UserEntity } from '@nest-starter/core';

export class SeedDataBodyDto {

}

export interface ISeedDataResponseDto {
  token: string;
  user: UserEntity;
}
