ALTER TABLE `users` MODIFY COLUMN `role` enum('Admin','Academy Head','Lecturer','Finance','Student') NOT NULL DEFAULT 'Student';--> statement-breakpoint
CREATE INDEX `name_idx` ON `users` (`name`);