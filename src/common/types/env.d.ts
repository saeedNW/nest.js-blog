/**
 * Extend the 'ProcessEnv' interface in the NodeJS namespace to create
 * globally accessible types for environment variables.
 *
 * Adding types here provides type suggestions when accessing variables
 * through 'process.env'.
 */

namespace NodeJS {
	interface ProcessEnv {
		/** Application configuration */
		SERVER_URL: string;
		PORT: number;

		/** Database configuration */
		DB_PORT: number;
		DB_NAME: string;
		DB_USERNAME: string;
		DB_PASSWORD: string;
		DB_HOST: string;

		/** Firebase config */
		FIREBASE_DATABASE_URL: string;
		FIREBASE_API_KEY: string;
	}
}
