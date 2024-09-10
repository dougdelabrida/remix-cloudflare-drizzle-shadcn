CREATE TABLE `businesses` (
	`id` integer PRIMARY KEY NOT NULL,
	`registrationId` text,
	`name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `registrationIdx` ON `businesses` (`registrationId`);