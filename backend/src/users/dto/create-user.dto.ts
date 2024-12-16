import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;
}
