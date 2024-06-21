ALTER TABLE `fields` DROP FOREIGN KEY `fields_courseId_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `materials` MODIFY COLUMN `price` int NOT NULL;--> statement-breakpoint
ALTER TABLE `fields` ADD CONSTRAINT `fields_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;