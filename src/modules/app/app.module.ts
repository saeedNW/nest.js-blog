import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";
import { FirebaseModule } from "../firebase/firebase.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/configs/typeorm.config";
import { HttpClientModule } from "../http/http.module";
import { PostModule } from "../post/post.module";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve(".env"),
			isGlobal: true,
		}),

		/** Load TypeOrm configs and stablish database connection */
		TypeOrmModule.forRoot(TypeOrmConfig()),

		/** Load modules */
		HttpClientModule,
		FirebaseModule,
		PostModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
