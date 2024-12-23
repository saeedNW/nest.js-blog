import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Min } from "class-validator";

export class AuthDto {
	@ApiProperty()
	@IsEmail({}, { message: "Invalid email format" })
	@Expose()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Expose()
	password: string;
}
