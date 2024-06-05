CREATE TABLE `usersToField` (
	`id` varchar(255) NOT NULL,
	`fieldId` varchar(255),
	`userId` varchar(255),
	CONSTRAINT `usersToField_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `usersToField` ADD CONSTRAINT `usersToField_fieldId_fields_id_fk` FOREIGN KEY (`fieldId`) REFERENCES `fields`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usersToField` ADD CONSTRAINT `usersToField_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;