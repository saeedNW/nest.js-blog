import {
	Injectable,
	ExecutionContext,
	UnauthorizedException,
	CanActivate,
} from "@nestjs/common";
import { Request } from "express";
import { FirebaseService } from "../firebase.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		/** Register auth service */
		private firebaseService: FirebaseService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		/** convert context to HTTP */
		const httpContext = context.switchToHttp();
		/** retrieve request object */
		const request: Request = httpContext.getRequest<Request>();
		/** retrieve token from client's request */
		const idToken: string = this.extractToken(request);

		/** validate token and retrieve user data */
		request.user = await this.firebaseService.verifyIdToken(idToken);

		return true;
	}

	/**
	 * Extracts the access token from the `Authorization` header
	 * @param {Request} request - The incoming request object
	 * @throws {UnauthorizedException} - In case of invalid token throw "Unauthorized Exception" error
	 * @returns {string} The extracted JWT token
	 */
	protected extractToken(request: Request): string {
		/** retrieve authorization header from request's headers object */
		const { authorization } = request.headers;

		/** throw an error if authorization header was not set or if it was empty */
		if (!authorization || authorization?.trim() == "") {
			throw new UnauthorizedException("Authorization field");
		}

		/** separate token from bearer keyword */
		const [bearer, idToken] = authorization?.split(" ");

		/** `throw error if the bearer keyword or the token were invalid */
		if (bearer?.toLowerCase() !== "bearer" || !idToken)
			throw new UnauthorizedException("Authorization field");

		/** return idToken access token */
		return idToken;
	}
}
