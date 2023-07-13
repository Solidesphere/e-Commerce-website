/*
  Warnings:

  - Made the column `isPaid` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "order" ALTER COLUMN "isPaid" SET NOT NULL,
ALTER COLUMN "isPaid" SET DEFAULT false;
