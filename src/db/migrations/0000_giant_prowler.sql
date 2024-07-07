CREATE TABLE `academies` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `academies_id` PRIMARY KEY(`id`),
	CONSTRAINT `academies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `academyHeadsToAcademies` (
	`id` varchar(255) NOT NULL,
	`academyId` varchar(255) NOT NULL,
	`academyHeadId` varchar(255) NOT NULL,
	CONSTRAINT `academyHeadsToAcademies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255),
	CONSTRAINT `accounts_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `attendances` (
	`id` varchar(255) NOT NULL,
	`studentId` varchar(255) NOT NULL,
	`classSessionId` varchar(255) NOT NULL,
	`name` enum('Present','Late','Absent','Sick') NOT NULL DEFAULT 'Present',
	CONSTRAINT `attendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classNotes` (
	`id` varchar(255) NOT NULL,
	`classId` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `classNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classSessions` (
	`id` varchar(255) NOT NULL,
	`classId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `classSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` varchar(255) NOT NULL,
	`courseId` varchar(255) NOT NULL,
	`creatorId` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`type` enum('Training Conference','Full Time','Part Time') NOT NULL DEFAULT 'Full Time',
	`price` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `classes_id` PRIMARY KEY(`id`),
	CONSTRAINT `classes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` varchar(255) NOT NULL,
	`academyId` varchar(255),
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` varchar(255),
	`status` enum('Active','Paused') DEFAULT 'Active',
	`price` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_name_unique` UNIQUE(`name`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `fields` (
	`id` varchar(255) NOT NULL,
	`courseId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`total` int NOT NULL,
	CONSTRAINT `fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lecturersToAcademies` (
	`id` varchar(255) NOT NULL,
	`academyId` varchar(255) NOT NULL,
	`lecturerId` varchar(255) NOT NULL,
	CONSTRAINT `lecturersToAcademies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marks` (
	`id` varchar(255) NOT NULL,
	`fieldId` varchar(255) NOT NULL,
	`studentId` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	CONSTRAINT `marks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` varchar(255) NOT NULL,
	`courseId` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`amount` int NOT NULL,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materialClassStudent` (
	`id` varchar(255) NOT NULL,
	`materialId` varchar(255) NOT NULL,
	`classId` varchar(255) NOT NULL,
	`studentId` varchar(255) NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `materialClassStudent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`classId` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`type` enum('EFT','Cash','Gateway') NOT NULL DEFAULT 'Cash',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `studentToClasses` (
	`id` varchar(255) NOT NULL,
	`studentId` varchar(255) NOT NULL,
	`classId` varchar(255) NOT NULL,
	CONSTRAINT `studentToClasses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3),
	`image` varchar(255),
	`role` enum('Admin','Academy Head','Lecturer','Finance','Student','Guardian') NOT NULL DEFAULT 'Student',
	`isGardian` boolean DEFAULT false,
	`activeTill` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verificationTokens` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationTokens_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
ALTER TABLE `academyHeadsToAcademies` ADD CONSTRAINT `academyHeadsToAcademies_academyId_academies_id_fk` FOREIGN KEY (`academyId`) REFERENCES `academies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `academyHeadsToAcademies` ADD CONSTRAINT `academyHeadsToAcademies_academyHeadId_users_id_fk` FOREIGN KEY (`academyHeadId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_studentId_users_id_fk` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_classSessionId_classSessions_id_fk` FOREIGN KEY (`classSessionId`) REFERENCES `classSessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classNotes` ADD CONSTRAINT `classNotes_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classSessions` ADD CONSTRAINT `classSessions_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_creatorId_users_id_fk` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_academyId_academies_id_fk` FOREIGN KEY (`academyId`) REFERENCES `academies`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fields` ADD CONSTRAINT `fields_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lecturersToAcademies` ADD CONSTRAINT `lecturersToAcademies_academyId_academies_id_fk` FOREIGN KEY (`academyId`) REFERENCES `academies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lecturersToAcademies` ADD CONSTRAINT `lecturersToAcademies_lecturerId_users_id_fk` FOREIGN KEY (`lecturerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marks` ADD CONSTRAINT `marks_fieldId_fields_id_fk` FOREIGN KEY (`fieldId`) REFERENCES `fields`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marks` ADD CONSTRAINT `marks_studentId_users_id_fk` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialClassStudent` ADD CONSTRAINT `materialClassStudent_materialId_materials_id_fk` FOREIGN KEY (`materialId`) REFERENCES `materials`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialClassStudent` ADD CONSTRAINT `materialClassStudent_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materialClassStudent` ADD CONSTRAINT `materialClassStudent_studentId_users_id_fk` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentToClasses` ADD CONSTRAINT `studentToClasses_studentId_users_id_fk` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentToClasses` ADD CONSTRAINT `studentToClasses_classId_classes_id_fk` FOREIGN KEY (`classId`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `slug_idx` ON `academies` (`slug`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `classes` (`slug`);--> statement-breakpoint
CREATE INDEX `slug_idx` ON `courses` (`slug`);