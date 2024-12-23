import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

/**
 * initialize swagger document
 * @param {INestApplication} app NestJS Application instance
 */
export function swaggerConfiguration(app: INestApplication) {
	/** define the swagger options and configs */
	const document = new DocumentBuilder()
		.setTitle("NestJS Blog")
		.setDescription("API documentation for NestJS Blog Project")
		.setVersion("1.0")
		.addBearerAuth(swaggerBearerAuthConfig(), "Authorization")
		.build();

	/** Initialize swagger document based on defined options */
	const swaggerDocument = SwaggerModule.createDocument(app, document);

	/** setup swagger ui page */
	SwaggerModule.setup("/api-doc", app, swaggerDocument);
}

/**
 * define and return swagger bearer auth scheme
 * @returns {SecuritySchemeObject} - Swagger bearer Auth scheme object
 */
function swaggerBearerAuthConfig(): SecuritySchemeObject {
	return {
		type: "http",
		bearerFormat: "JWT",
		in: "header",
		scheme: "bearer",
	};
}
