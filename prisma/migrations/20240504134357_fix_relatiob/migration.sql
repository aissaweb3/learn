/*
  Warnings:

  - You are about to drop the column `projectId` on the `team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_projectId_fkey`;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `projectId`;

-- CreateTable
CREATE TABLE `ProjectTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teamId` INTEGER NOT NULL,
    `projectId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectTeam` ADD CONSTRAINT `ProjectTeam_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectTeam` ADD CONSTRAINT `ProjectTeam_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
