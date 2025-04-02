CREATE TABLE `comment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` text,
	`userid` varchar(36),
	`blogid` int,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_userid_users_id_fk` FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comment` ADD CONSTRAINT `comment_blogid_blog_id_fk` FOREIGN KEY (`blogid`) REFERENCES `blog`(`id`) ON DELETE no action ON UPDATE no action;