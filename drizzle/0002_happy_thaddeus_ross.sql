CREATE TABLE `blog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`content` text,
	`authorid` varchar(36),
	`isPremium` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `blog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog` ADD CONSTRAINT `blog_authorid_users_id_fk` FOREIGN KEY (`authorid`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;