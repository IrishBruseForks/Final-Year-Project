-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2024-01-30T00:31:42.524Z

CREATE TABLE `Users` (
  `id` char(32) PRIMARY KEY,
  `username` text,
  `picture` text,
  `isBot` boolean
);

CREATE TABLE `Channels` (
  `id` char(36) PRIMARY KEY,
  `name` text,
  `picture` text,
  `lastMessage` char(36)
);

CREATE TABLE `Messages` (
  `id` char(36) PRIMARY KEY,
  `channelId` char(36),
  `sentBy` char(32),
  `sentOn` timestamp,
  `content` text
);

CREATE TABLE `Users_Channels` (
  `Users_id` char(32),
  `Channels_id` char(36),
  PRIMARY KEY (`Users_id`, `Channels_id`)
);

ALTER TABLE `Users_Channels` ADD FOREIGN KEY (`Users_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Users_Channels` ADD FOREIGN KEY (`Channels_id`) REFERENCES `Channels` (`id`);


ALTER TABLE `Messages` ADD FOREIGN KEY (`channelId`) REFERENCES `Channels` (`id`);
