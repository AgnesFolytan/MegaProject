import { YarnTypes } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNumber()
    sku: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    discount: number;


    @IsNotEmpty()
    @IsEnum(YarnTypes)
    yarn: YarnTypes;

    @IsNumber()
    size: number;
}
