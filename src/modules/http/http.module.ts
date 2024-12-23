import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { FirebaseApiService } from "./firebase.service";

@Global()
@Module({
	imports: [
		/** Register timeout for requested come to the module */
		HttpModule.register({
			timeout: 10000,
		}),
	],
	providers: [FirebaseApiService],
	exports: [FirebaseApiService],
})
export class HttpClientModule {}
