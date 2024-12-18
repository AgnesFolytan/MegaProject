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
  /*@IsStrongPassword({
    minLength: 10, 
    minLowercase: 2,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })*/
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType = UserType.customer;
}
