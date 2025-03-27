/*
  Warnings:

  - You are about to drop the column `tokenId` on the `OAuthToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId,accessToken]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OAuthToken_tokenId_key";

-- AlterTable
ALTER TABLE "OAuthToken" DROP COLUMN "tokenId",
ALTER COLUMN "scope" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "OAuthToken_ownerId_idx" ON "OAuthToken"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_ownerId_accessToken_key" ON "OAuthToken"("ownerId", "accessToken");
