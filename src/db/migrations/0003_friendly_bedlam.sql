ALTER TABLE `classSessions` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `classSessions` ADD `updatedAt` timestamp DEFAULT (now());