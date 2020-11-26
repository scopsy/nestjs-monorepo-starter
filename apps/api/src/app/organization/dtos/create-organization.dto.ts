import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICreateOrganizationDto } from '@nest-starter/shared';

export class CreateOrganizationDto implements ICreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  taxIdentifier: string;
}
