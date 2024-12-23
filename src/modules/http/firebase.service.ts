import { HttpService } from "@nestjs/axios";
import {
	BadRequestException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { lastValueFrom, map } from "rxjs";
import { AuthDto } from "../firebase/dto/auth.dto";

@Injectable()
export class FirebaseApiService {
	constructor(
		/** Register axios http service */
		private httpService: HttpService
	) {}

	/**
	 * Firebase API request for logging users in using email and password
	 * @param {AuthDto} authDto - User's authentication credentials
	 */
	async signInWithPassword(authDto: AuthDto) {
		/** Create request valid data structure */
		const data = { ...authDto, returnSecureToken: true };

		/** Create request valid headers structure */
		const headers = {
			"content-type": "application/json",
			Accept: "text/plain",
		};

		/** Extract sms ir related ENVs from process */
		const { FIREBASE_API_KEY } = process.env;

		/** Firebase authentication API URL */
		const SignInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

		try {
			/** Send the request to firebase */
			const response = await lastValueFrom(
				this.httpService
					.post(SignInUrl, data, {
						headers,
					})
					.pipe(map((res) => res.data))
			);

			return { idToken: response.idToken, refreshToken: response.refreshToken };
		} catch (error) {
			/** Catch and throw errors */
			if (error?.response?.data?.error?.code === HttpStatus.BAD_REQUEST) {
				throw new BadRequestException(error?.response?.data?.error?.message);
			} else {
				throw new InternalServerErrorException(
					"Firebase API Error: " + error?.response?.data?.error?.message ||
						error.message
				);
			}
		}
	}
}
