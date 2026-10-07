import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of user' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john.doe@acme.com', description: 'User corporate email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'Initial password' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: '+55 11 99999-9999', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;
}
