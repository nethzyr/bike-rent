/*
  Warnings:

  - A unique constraint covering the columns `[rentalId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rentalId` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Rating` ADD COLUMN `rentalId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Rating_rentalId_key` ON `Rating`(`rentalId`);
