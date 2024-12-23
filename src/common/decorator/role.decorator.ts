import { SetMetadata } from "@nestjs/common";
import { Roles } from "../enums/role.enum";

/**
 * Custom decorator to define access control based on roles.
 * This decorator applies metadata to specify which roles can access a
 * particular resource, making the controller code cleaner and easier to manage.
 */
export const ROLE_KEY = "ROLES";
export const CanAccess = (...roles: Roles[]) => SetMetadata(ROLE_KEY, roles);
