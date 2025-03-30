/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `GoogleWatch` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `historyId` on the `GoogleWatch` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "GoogleWatch" DROP COLUMN "historyId",
ADD COLUMN     "historyId" BIGINT NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GoogleWatch_userId_key" ON "GoogleWatch"("userId");
