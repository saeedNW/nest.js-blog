import { ApiProperty } from "@nestjs/swagger";
import { CreateApiBaseResponse } from "src/common/abstracts/base.response";

/**
 * Firebase login/register success response
 */
export class AuthSuccessResponse extends CreateApiBaseResponse {
	@ApiProperty({
		description: "Response data",
		example: { idToken: "JWT Token", refreshToken: "JWT Token" },
	})
	data: { idToken: string; refreshToken: string };
}
