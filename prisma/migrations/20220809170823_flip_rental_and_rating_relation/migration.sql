/*
  Warnings:

  - You are about to drop the column `rentalId` on the `Rating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ratingId]` on the table `Rental` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Rating_rentalId_key` ON `Rating`;

-- AlterTable
ALTER TABLE `Rating` DROP COLUMN `rentalId`;

-- AlterTable
ALTER TABLE `Rental` ADD COLUMN `ratingId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Rental_ratingId_key` ON `Rental`(`ratingId`);
