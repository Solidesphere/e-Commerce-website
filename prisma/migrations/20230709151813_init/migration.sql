/*
  Warnings:

  - You are about to drop the column `name` on the `review` table. All the data in the column will be lost.
  - Added the required column `userId` to the `review` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_productId_fkey";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "name",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
