/*
  Warnings:

  - You are about to drop the column `userId` on the `SyncToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId,taskListId]` on the table `SyncToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `SyncToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SyncToken" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SyncToken_ownerId_taskListId_key" ON "SyncToken"("ownerId", "taskListId");

-- AddForeignKey
ALTER TABLE "SyncToken" ADD CONSTRAINT "SyncToken_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
