import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { FirebaseModule } from "../firebase/firebase.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";

@Module({
	imports: [FirebaseModule, TypeOrmModule.forFeature([PostEntity])],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
