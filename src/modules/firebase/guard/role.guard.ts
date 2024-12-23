import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLE_KEY } from "src/common/decorator/role.decorator";
import { Roles } from "src/common/enums/role.enum";

/**
 * Custom guard to enforce role-based access control.
 */
@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		/** Retrieve the required roles from the metadata for the handler or class. */
		const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		/** If no roles are required, allow access by default. */
		if (!requiredRoles || requiredRoles.length === 0) return true;

		/** Extract the user's data from the request in execution context. */
		const request: Request = context.switchToHttp().getRequest<Request>();
		const user = request.user;

		/** Retrieve the user's roles or assign a default role. */
		const userRole = user?.roles ?? Roles.USER;

		/** Allow access if the user is an admin, regardless of other roles. */
		if (userRole.includes(Roles.ADMIN)) return true;

		/** Deny access if the user does not have the required roles. */
		throw new ForbiddenException("Access Denied, Admin access only");
	}
}
