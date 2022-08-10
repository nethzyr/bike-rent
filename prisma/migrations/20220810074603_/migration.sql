/*
  Warnings:

  - You are about to drop the column `ratingId` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rating` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Rental_ratingId_key` ON `Rental`;

-- AlterTable
ALTER TABLE `Bike` MODIFY `available` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Rental` DROP COLUMN `ratingId`,
    ADD COLUMN `rating` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Rating`;
