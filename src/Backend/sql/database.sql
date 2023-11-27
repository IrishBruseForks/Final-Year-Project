-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2023-11-27T00:53:47.799Z

CREATE TABLE `Users` (
  `id` char(32) PRIMARY KEY,
  `username` text,
  `picture` text,
  `isBot` boolean
);

CREATE TABLE `Channels` (
  `id` varchar(36) PRIMARY KEY,
  `name` text,
  `picture` text,
  `lastMessage` varchar(36)
);

CREATE TABLE `Messages` (
  `id` varchar(36) PRIMARY KEY,
  `channelId` varchar(36),
  `sentBy` char(32),
  `sentOn` timestamp,
  `content` text
);

CREATE TABLE `Users_Channels` (
  `Users_id` char(32),
  `Channels_id` varchar(36),
  PRIMARY KEY (`Users_id`, `Channels_id`)
);

ALTER TABLE `Users_Channels` ADD FOREIGN KEY (`Users_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Users_Channels` ADD FOREIGN KEY (`Channels_id`) REFERENCES `Channels` (`id`);


ALTER TABLE `Messages` ADD FOREIGN KEY (`channelId`) REFERENCES `Channels` (`id`);
