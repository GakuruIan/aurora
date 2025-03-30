/*
  Warnings:

  - You are about to drop the column `description` on the `GoogleTask` table. All the data in the column will be lost.
  - The `completed` column on the `GoogleTask` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `SyncToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GoogleTask" DROP COLUMN "description",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'needsAction',
DROP COLUMN "completed",
ADD COLUMN     "completed" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SyncToken" ADD COLUMN     "userId" TEXT NOT NULL;
