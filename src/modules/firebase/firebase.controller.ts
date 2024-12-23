// src/firebase/firebase.controller.ts

import { Controller, Post, Body, Get, Patch } from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import { ApiTags, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { AuthDto } from "./dto/auth.dto";
import { plainToClass } from "class-transformer";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { ApiAuthResponses } from "./decorators/check-otp-responses.decorator";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { AuthDecorator } from "src/common/decorator/auth.decorator";

@ApiTags("Firebase")
@Controller("firebase")
export class FirebaseController {
	constructor(private readonly firebaseService: FirebaseService) {}

	/**
	 * Firebase login process
	 * @param {AuthDto} authDto - User's authentication credentials
	 */
	@Post("login")
	@ApiOperation({ summary: "Login with Firebase" })
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	@ApiAuthResponses()
	async login(@Body() authDto: AuthDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(AuthDto, authDto, {
			excludeExtraneousValues: true,
		});

		return this.firebaseService.login(filteredData);
	}

	/**
	 * Register method using Firebase Authentication
	 * @param {AuthDto} authDto - User's authentication credentials
	 */
	@Post("register")
	@ApiOperation({ summary: "Register with Firebase" })
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	@ApiAuthResponses()
	async register(@Body() authDto: AuthDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(AuthDto, authDto, {
			excludeExtraneousValues: true,
		});

		return this.firebaseService.register(filteredData);
	}

	/**
	 * Retrieve all users
	 */
	@Get("users")
	@ApiOperation({ summary: "Retrieve all users from Firebase" })
	@AuthDecorator()
	findAllUsers() {
		return this.firebaseService.getUsers();
	}

	/**
	 * Update user role
	 * @param updateRoleDto - User's new role data
	 */
	@Patch("users/role")
	@ApiOperation({ summary: "Update users role" })
	@ApiConsumes(SwaggerConsumes.JSON)
	@AuthDecorator()
	updateRole(@Body() updateRoleDto: UpdateRoleDto) {
		return this.firebaseService.updateRole(updateRoleDto);
	}
}
