import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import { swaggerConfiguration } from "./configs/swagger.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { HttpExceptionFilter } from "./common/Filters/exception.filter";
import { UnprocessableEntityPipe } from "./common/pipe/unprocessable-entity.pipe";
import { ResponseTransformerInterceptor } from "./common/interceptor/response-transformer.interceptor";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	/** Register public folder as static files directory */
	app.useStaticAssets("public");

	/** initialize custom exception filter */
	app.useGlobalFilters(new HttpExceptionFilter());

	/** initialize custom validation pipe */
	app.useGlobalPipes(new UnprocessableEntityPipe());

	/** initialize custom response interceptor */
	app.useGlobalInterceptors(new ResponseTransformerInterceptor());

	/** initialize swagger */
	swaggerConfiguration(app);

	await app.listen(process.env.PORT ?? 3000, () =>
		console.log(`Running on ${process.env.SERVER_URL}`)
	);
}
bootstrap();
