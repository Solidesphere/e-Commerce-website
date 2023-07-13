/*
  Warnings:

  - You are about to drop the `orderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderItems` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_OrderId_fkey";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "orderItems" JSONB NOT NULL;

-- DropTable
DROP TABLE "orderItem";
