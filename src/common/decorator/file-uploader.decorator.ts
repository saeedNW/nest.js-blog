import {
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	UploadedFile,
} from "@nestjs/common";

/**
 * custom decorators for handling file upload in controllers.
 * Combines Uploaded Files with a ParseFilePipe into a custom decorator
 * to make the controller code cleaner and easier to maintain.
 */

export function FileUploader() {
	return UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({
					maxSize: 5 * 1024 * 1024,
					message: "file is to large",
				}),
				new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
			],
		})
	);
}

export function OptionalFileUploader() {
	return UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({
					maxSize: 5 * 1024 * 1024,
					message: "File is too large",
				}),
				new FileTypeValidator({
					fileType: "image/(png|jpg|jpeg|webp)",
				}),
			],
			fileIsRequired: false,
		})
	);
}
