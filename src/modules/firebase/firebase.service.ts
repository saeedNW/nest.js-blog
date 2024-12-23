// src/firebase/firebase.service.ts

import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as admin from "firebase-admin";
import { AuthDto } from "./dto/auth.dto";
import { FirebaseApiService } from "../http/firebase.service";
import { IUser } from "../user/interface/user.interface";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class FirebaseService {
	constructor(
		/** Load firebase api service */
		private firebaseApiService: FirebaseApiService
	) {

		const firebaseServiceAccountPath =
			process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
		
		/** initialize firebase application connection */
		admin.initializeApp({
			credential: admin.credential.cert(
				firebaseServiceAccountPath as admin.ServiceAccount
			),
			databaseURL: process.env.FIREBASE_DATABASE_URL,
		});
	}

	/**
	 * Firebase login process
	 *
	 * ? Note: According to the Firebase documentation, in the usual case,
	 * ? user authentication is handled by Firebase on the front end, so the
	 * ? firebase-admin module, which is used to handle the backend activities
	 * ? of this system, does not have the ability to implement some basic
	 * ? features such as password validation, although this issue can be handled
	 * ? using the Firebase APIs. Therefore, the APIs of this system have been used
	 * ? directly to implement user login.
	 * @param {AuthDto} authDto - User's authentication credentials
	 */
	async login(authDto: AuthDto) {
		/** Use firebase API to complete login process */
		const { idToken, refreshToken } =
			await this.firebaseApiService.signInWithPassword(authDto);

		return { idToken, refreshToken };
	}

	/**
	 * Register method using Firebase Authentication
	 * @param {AuthDto} authDto - User's authentication credentials
	 */
	async register(authDto: AuthDto) {
		// Firebase user creation
		await admin.auth().createUser(authDto);

		/** Use firebase API to complete login process */
		const { idToken, refreshToken } =
			await this.firebaseApiService.signInWithPassword(authDto);

		return { idToken, refreshToken };
	}

	/**
	 * user's id token validation
	 * @param {string} idToken - id token retrieved from firebase
	 * @throws {UnauthorizedException} - In case of invalid token throw "Unauthorized Exception" error
	 * @returns {Promise<IUser | never>} - Returns user's data or throw an error
	 */
	async verifyIdToken(idToken: string): Promise<IUser | never> {
		/** Verify Firebase ID token */
		const decodedToken = await admin.auth().verifyIdToken(idToken);

		/** retrieve user's data from firebase */
		const userRecord = await admin.auth().getUser(decodedToken.uid);

		/** throw error if user was not found */
		if (!userRecord) {
			throw new UnauthorizedException("User does not exist");
		}

		/** Destructure user record properties and extract needed data */
		const {
			uid,
			email,
			emailVerified,
			displayName,
			photoURL,
			phoneNumber,
			customClaims,
		} = userRecord;

		return {
			uid,
			roles: customClaims?.roles,
			email,
			emailVerified,
			displayName,
			photoURL,
			phoneNumber,
		};
	}

	/**
	 * Retrieve all users
	 */
	async getUsers() {
		/** Define an empty array to store users data */
		const users = [];

		/** Define a variable to store the next page token for paginated results */
		let nextPageToken: string | undefined = undefined;

		do {
			/** Retrieve a Partial of users from firebase (About 1000 users) */
			const result = await admin.auth().listUsers(1000, nextPageToken);
			/** Add the retrieved data to users array */
			users.push(...result.users);
			/** Update the nextPageToken */
			nextPageToken = result.pageToken;
			/** Continue the process while there's a next page of users */
		} while (nextPageToken);

		/** Simplify the retrieved data for each users and only keep needed data */
		return users.map((user) => ({
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			phoneNumber: user.phoneNumber,
			disabled: user.disabled,
			roles: user?.customClaims?.roles,
		}));
	}

	/**
	 * Update user role
	 * @param updateRoleDto - User's new role data
	 */
	async updateRole(updateRoleDto: UpdateRoleDto) {
		/** Destructure role data object */
		const { roles, userUid } = updateRoleDto;

		/** Add role to user's data */
		await admin.auth().setCustomUserClaims(userUid, { roles });

		return "User's role updated successfully";
	}
}
