CREATE TABLE `ceremony` (
	`year` integer PRIMARY KEY NOT NULL,
	`departments` text NOT NULL,
	`nomination_start_at` integer NOT NULL,
	`voting_start_at` integer NOT NULL,
	`award_start_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ranking_in_vote` (
	`vote_id` integer NOT NULL,
	`work_id` integer NOT NULL,
	`ranking` integer NOT NULL,
	PRIMARY KEY(`vote_id`, `work_id`),
	FOREIGN KEY (`vote_id`) REFERENCES `vote`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`work_id`) REFERENCES `work`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vote` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`voter_id` integer NOT NULL,
	`department` text NOT NULL,
	FOREIGN KEY (`year`) REFERENCES `ceremony`(`year`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`voter_id`) REFERENCES `voter`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `voter` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`password_hash` text
);
--> statement-breakpoint
CREATE TABLE `work` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`department` text NOT NULL,
	`name` text NOT NULL,
	`origin_name` text,
	`aliases` text,
	`ranking` integer,
	FOREIGN KEY (`year`) REFERENCES `ceremony`(`year`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `ranking_in_vote_work_id_idx` ON `ranking_in_vote` (`work_id`);--> statement-breakpoint
CREATE INDEX `vote_voter_id_idx` ON `vote` (`voter_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `vote_year_department_voter_idx` ON `vote` (`year`,`department`,`voter_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `voter_name_unique` ON `voter` (`name`);--> statement-breakpoint
CREATE INDEX `work_name_idx` ON `work` (`year`,`department`,`name`);--> statement-breakpoint
CREATE INDEX `work_origin_name_idx` ON `work` (`year`,`department`,`origin_name`);--> statement-breakpoint
CREATE INDEX `work_aliases_idx` ON `work` (`year`,`department`,`aliases`);