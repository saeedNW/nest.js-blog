import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { TMulterFile, uploadFinalization } from "src/common/utils/multer.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginate, PaginatedResult } from "src/common/utils/pagination.utils";

@Injectable()
export class PostService {
	constructor(
		/** Load post entity */
		@InjectRepository(PostEntity)
		private postRepository: Repository<PostEntity>
	) {}

	/**
	 * Create new post and save in database
	 * @param {CreatePostDto} createPostDto New post's data
	 * @param {TMulterFile} image - post's image
	 */
	async create(
		createPostDto: CreatePostDto,
		image: TMulterFile
	): Promise<string> {
		/** Finalize the post image upload process */
		const imagePath = await uploadFinalization(image, "/posts");

		/** Create new post data */
		let post = this.postRepository.create({
			...createPostDto,
			image: imagePath,
		});

		/** Save post data to database */
		post = await this.postRepository.save(post);

		return "Post created successfully.";
	}

	/**
	 * Retrieve posts data with pagination
	 * @param {PaginationDto} paginationDto - Pagination data
	 * @returns {Promise<PaginatedResult<PostEntity>>} Retrieved data plus pagination meta data
	 */
	async findAll(
		paginationDto: PaginationDto
	): Promise<PaginatedResult<PostEntity>> {
		/** Retrieve posts with pagination */
		return await paginate(
			paginationDto,
			this.postRepository,
			undefined,
			process.env.SERVER_URL + "/post"
		);
	}

	/**
	 * Retrieve single post by id number
	 * @param {number} id post's id number
	 * @returns {Promise<PostEntity>} Single post data object
	 */
	async findOne(id: number): Promise<PostEntity> {
		/** Retrieve post's data from database */
		const post = await this.postRepository.findOneBy({ id });
		/** throw error if post was not found */
		if (!post) throw new NotFoundException("Post not found.");
		/** return post's data object */
		return post;
	}

	/**
	 * Update posts data
	 * @param {number} id - Post's ID number
	 * @param {UpdatePostDto} updatePostDto - Post's new data
	 * @param {TMulterFile} image - Post's new image
	 */
	async update(
		id: number,
		updatePostDto: UpdatePostDto,
		image: TMulterFile
	): Promise<string> {
		/** check if post existence */
		let post = await this.findOne(id);

		/** Finalize the post image upload process if image was provided */
		if (image) {
			// TODO: Delete the old image if necessary.
			updatePostDto.image = await uploadFinalization(image, "/posts");
		}

		/** Update post data */
		Object.assign(post, {
			...updatePostDto,
		});

		/** Save post data to database */
		post = await this.postRepository.save(post);

		return "Post Updated successfully.";
	}

	/**
	 * Remove post by id number
	 * @param {number} id post's id number
	 * @returns {Promise<string>} success message
	 */
	async remove(id: number): Promise<string> {
		/** check if post exist */
		await this.findOne(id);
		/** remove post */
		await this.postRepository.delete({ id });
		/** return success response */
		return "Post removed successfully";
	}
}
