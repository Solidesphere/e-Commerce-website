/*
  Warnings:

  - Changed the type of `ShippingAddress` on the `order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "ShippingAddress",
ADD COLUMN     "ShippingAddress" JSONB NOT NULL;
