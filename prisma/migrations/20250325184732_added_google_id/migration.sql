/*
  Warnings:

  - You are about to drop the column `email` on the `OAuthToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,googleEmail]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleEmail` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleId` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OAuthToken_email_key";

-- DropIndex
DROP INDEX "OAuthToken_ownerId_email_key";

-- AlterTable
ALTER TABLE "OAuthToken" DROP COLUMN "email",
ADD COLUMN     "googleEmail" TEXT NOT NULL,
ADD COLUMN     "googleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_googleId_key" ON "OAuthToken"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_ownerId_googleEmail_key" ON "OAuthToken"("ownerId", "googleEmail");
