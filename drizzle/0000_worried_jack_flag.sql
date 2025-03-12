CREATE TABLE `roles` (
	`id` int NOT NULL,
	`name` varchar(255),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(32) NOT NULL,
	`username` varchar(255),
	`firstName` varchar(255),
	`lastName` varchar(255),
	`email` varchar(255),
	`password` varchar(255),
	`roleid` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_roleid_roles_id_fk` FOREIGN KEY (`roleid`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;