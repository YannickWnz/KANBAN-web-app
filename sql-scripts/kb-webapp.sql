-- CREATE DATABASE
CREATE DATABASE IF NOT EXISTS `kanban-web-app`;

-- CREATE USER TABLE
-- CREATE TABLE users (
--     userIP_Address INT PRIMARY KEY NOT NULL
-- );

-- CREATE BOARD TABLE
CREATE TABLE `board` (
    `boardID` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `boardName` VARCHAR(50) NOT NULL,
    `boardUniqID` VARCHAR(100)
);


-- CREATE TASK TABLE
CREATE TABLE `task` (
    `taskID` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `taskTitle` VARCHAR(255) NOT NULL,
    `taskDescription` VARCHAR(255) NOT NULL,
    `substasks` JSON,
    `completedSubtasks` JSON,
    `taskStatus` VARCHAR(10) NOT NULL,
    `boardID` INT,
    FOREIGN KEY (`boardID`) REFERENCES `board`(`boardID`)
);


-- ALTER TABLE task ADD COLUMN completedSubtasks JSON AFTER substasks;