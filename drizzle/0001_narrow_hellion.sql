ALTER TABLE `roles` RENAME COLUMN `id` TO `roleid`;--> statement-breakpoint
ALTER TABLE `users` DROP FOREIGN KEY `users_roleid_roles_id_fk`;
--> statement-breakpoint
ALTER TABLE `roles` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `roles` MODIFY COLUMN `roleid` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` ADD PRIMARY KEY(`roleid`);--> statement-breakpoint
ALTER TABLE `users` ADD `googleId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_roleid_roles_roleid_fk` FOREIGN KEY (`roleid`) REFERENCES `roles`(`roleid`) ON DELETE no action ON UPDATE no action;