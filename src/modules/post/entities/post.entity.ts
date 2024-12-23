import { BaseTimestampedEntity } from "src/common/abstracts/base.entity";
import { AfterLoad, Column, Entity } from "typeorm";

@Entity("post")
export class PostEntity extends BaseTimestampedEntity {
	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	image: string;

	@AfterLoad()
	map() {
		this.image = process.env.SERVER_URL + this.image;
	}
}
