import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreatePostDto {
	@ApiProperty()
	@IsString()
	@Length(10, 150)
	@Expose()
	title: string;

	@ApiProperty()
	@IsString()
	@Length(30)
	@Expose()
	content: string;

	@ApiProperty({ format: "binary" })
	@Expose()
	image: string;
}
