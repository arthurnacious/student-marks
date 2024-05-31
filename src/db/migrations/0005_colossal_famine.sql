ALTER TABLE `fields` DROP FOREIGN KEY `fields_courseId_courses_id_fk`;
--> statement-breakpoint
ALTER TABLE `courses` MODIFY COLUMN `academyId` varchar(255);--> statement-breakpoint
ALTER TABLE `fields` MODIFY COLUMN `courseId` varchar(255);--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_academyId_academies_id_fk` FOREIGN KEY (`academyId`) REFERENCES `academies`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fields` ADD CONSTRAINT `fields_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE set null ON UPDATE no action;