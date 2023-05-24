-- CreateTable
CREATE TABLE `Danmu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `msg` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `uname` VARCHAR(191) NOT NULL,
    `badge` JSON NULL,
    `identityInfo` JSON NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `receiveTime` DATETIME(3) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SC` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `msg` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `uname` VARCHAR(191) NOT NULL,
    `badge` JSON NULL,
    `identityInfo` JSON NULL,
    `color` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `time` INTEGER NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `receiveTime` DATETIME(3) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `uname` VARCHAR(191) NOT NULL,
    `badge` JSON NULL,
    `identityInfo` JSON NULL,
    `giftName` VARCHAR(191) NOT NULL,
    `giftId` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `amount` INTEGER NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `receiveTime` DATETIME(3) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuardBuy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `uname` VARCHAR(191) NOT NULL,
    `giftId` INTEGER NOT NULL,
    `giftName` VARCHAR(191) NOT NULL,
    `guardLevel` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `receiveTime` DATETIME(3) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(191) NOT NULL,
    `cover` VARCHAR(191) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `hot` INTEGER NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DanmuCount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Raw` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoomInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` VARCHAR(191) NOT NULL,
    `shortId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `face` LONGTEXT NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RoomInfo_roomId_key`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Danmu` ADD CONSTRAINT `Danmu_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `RoomInfo`(`roomId`) ON DELETE RESTRICT ON UPDATE CASCADE;
