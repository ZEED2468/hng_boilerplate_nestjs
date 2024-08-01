import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty({
    description: 'The name of the region',
    example: 'North America',
  })
  @IsString()
  region: string;

  @ApiProperty({
    description: 'A description of the region',
    example: 'North America region',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRegionDto {
  @ApiProperty({
    description: 'The name of the region',
    example: 'North America',
  })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({
    description: 'A description of the region',
    example: 'North America region',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
