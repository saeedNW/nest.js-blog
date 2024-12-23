import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

/**
 * Defines base entities to be reused across other entities,
 * reducing code duplication and ensuring consistent structure
 * in each entity file.
 */
export class BaseTimestampedEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@CreateDateColumn()
	created_at: Date;
	
	@UpdateDateColumn()
	updated_at: Date;
}
