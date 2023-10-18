-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2023-10-17T22:31:41.274Z

CREATE TABLE `Users` (
  `userId` char(32) PRIMARY KEY,
  `username` text,
  `picture` text
);

CREATE TABLE `Channels` (
  `chanId` bigint PRIMARY KEY,
  `lastMessage` bigint
);

CREATE TABLE `Messages` (
  `msgId` bigint PRIMARY KEY,
  `chanId` bigint,
  `sentBy` char(32),
  `sentOn` timestamp
);

ALTER TABLE `Channels` ADD FOREIGN KEY (`lastMessage`) REFERENCES `Messages` (`msgId`);

ALTER TABLE `Messages` ADD FOREIGN KEY (`chanId`) REFERENCES `Channels` (`chanId`);

ALTER TABLE `Messages` ADD FOREIGN KEY (`sentBy`) REFERENCES `Users` (`userId`);

CREATE TABLE `Channels_Users` (
  `Channels_chanId` bigint,
  `Users_userId` char(32),
  PRIMARY KEY (`Channels_chanId`, `Users_userId`)
);

ALTER TABLE `Channels_Users` ADD FOREIGN KEY (`Channels_chanId`) REFERENCES `Channels` (`chanId`);

ALTER TABLE `Channels_Users` ADD FOREIGN KEY (`Users_userId`) REFERENCES `Users` (`userId`);

