/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `OAuthToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuthToken" ADD COLUMN     "tokenId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_tokenId_key" ON "OAuthToken"("tokenId");
