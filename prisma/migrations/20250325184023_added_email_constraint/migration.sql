/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,email]` on the table `OAuthToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OAuthToken_ownerId_accessToken_key";

-- AlterTable
ALTER TABLE "OAuthToken" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_email_key" ON "OAuthToken"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthToken_ownerId_email_key" ON "OAuthToken"("ownerId", "email");
