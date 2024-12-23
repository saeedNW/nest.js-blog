import { IUser } from "src/modules/user/interface/user.interface";

/**
 * Add an optional `user` property to the Request interface
 */

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

declare module "express-serve-static-core" {
	export interface Request {
		user?: IUser;
	}
}
