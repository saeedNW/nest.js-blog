import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
	UseInterceptors,
	Query,
	ParseIntPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	multerImageUploader,
	TMulterFile,
} from "src/common/utils/multer.utils";
import {
	FileUploader,
	OptionalFileUploader,
} from "src/common/decorator/file-uploader.decorator";
import { ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { plainToClass } from "class-transformer";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { deleteInvalidPropertyInObject } from "src/common/utils/functions.utils";
import { CanAccess } from "src/common/decorator/role.decorator";
import { Roles } from "src/common/enums/role.enum";

@Controller("post")
@AuthDecorator()
export class PostController {
	constructor(private readonly postService: PostService) {}

	/**
	 * Create new blog and save in database
	 * @param {CreatePostDto} createPostDto New blog's data
	 * @param {TMulterFile} image - Blog's image
	 */
	@Post()
	@UseInterceptors(FileInterceptor("image", multerImageUploader()))
	@ApiConsumes(SwaggerConsumes.MULTIPART_FORM_DATA)
	create(
		@Body() createPostDto: CreatePostDto,
		@FileUploader() image: TMulterFile
	): Promise<string> {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(CreatePostDto, createPostDto, {
			excludeExtraneousValues: true,
		});

		return this.postService.create(filteredData, image);
	}

	/**
	 * Retrieve posts data with pagination
	 * @param {PaginationDto} paginationDto - Pagination data
	 */
	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.postService.findAll(paginationDto);
	}

	/**
	 * Retrieve posts data with pagination (Admin access only)
	 * @param {PaginationDto} paginationDto - Pagination data
	 */
	@Get("restricted")
	@ApiOperation({
		summary: "Only users with the admin role can access this feature",
	})
	@CanAccess(Roles.ADMIN)
	restrictedFindAll(@Query() paginationDto: PaginationDto) {
		return this.postService.findAll(paginationDto);
	}

	/**
	 * Retrieve single post by id number
	 * @param {number} id post's id number
	 */
	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.postService.findOne(id);
	}

	/**
	 * Update posts data
	 * @param {number} id - Post's ID number
	 * @param {UpdatePostDto} updatePostDto - Post's new data
	 * @param {TMulterFile} image - Post's new image
	 */
	@Put(":id")
	@UseInterceptors(FileInterceptor("image", multerImageUploader()))
	@ApiConsumes(SwaggerConsumes.MULTIPART_FORM_DATA)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updatePostDto: UpdatePostDto,
		@OptionalFileUploader() image: TMulterFile
	) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(UpdatePostDto, updatePostDto, {
			excludeExtraneousValues: true,
		});

		/** Remove invalid data */
		deleteInvalidPropertyInObject(filteredData);

		return this.postService.update(id, filteredData, image);
	}

	/**
	 * Remove post by id number
	 * @param {number} id post's id number
	 * @returns {Promise<string>} success message
	 */
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number): Promise<string> {
		return this.postService.remove(id);
	}
}
