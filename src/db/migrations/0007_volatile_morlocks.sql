CREATE TABLE `classNotes` (
	`id` varchar(255) NOT NULL,
	`classId` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `classNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `classNotes` ADD CONSTRAINT `classNotes_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `notes`;