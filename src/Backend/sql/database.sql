-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2023-11-03T02:40:59.471Z

CREATE TABLE `Users` (
  `id` char(32) PRIMARY KEY,
  `username` text,
  `picture` text,
  `isBot` boolean
);

CREATE TABLE `Channels` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `name` text,
  `picture` text,
  `lastMessage` bigint
);

CREATE TABLE `Messages` (
  `id` bigint PRIMARY KEY AUTO_INCREMENT,
  `channelId` bigint,
  `sentBy` char(32),
  `sentOn` timestamp,
  `content` text
);

CREATE TABLE `Users_Channels` (
  `Users_id` char(32),
  `Channels_id` bigint,
  PRIMARY KEY (`Users_id`, `Channels_id`)
);

ALTER TABLE `Users_Channels` ADD FOREIGN KEY (`Users_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Users_Channels` ADD FOREIGN KEY (`Channels_id`) REFERENCES `Channels` (`id`);


ALTER TABLE `Messages` ADD FOREIGN KEY (`channelId`) REFERENCES `Channels` (`id`);
