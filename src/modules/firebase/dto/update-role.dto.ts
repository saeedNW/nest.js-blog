import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
	ArrayMinSize,
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsString,
} from "class-validator";
import { Roles } from "src/common/enums/role.enum";

export class UpdateRoleDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@Expose()
	userUid: string;

	@ApiProperty()
	@IsArray()
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@IsEnum(Roles, { each: true })
	roles: Roles[];
}
