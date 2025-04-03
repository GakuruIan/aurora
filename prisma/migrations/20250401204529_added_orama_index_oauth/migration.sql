-- AlterTable
ALTER TABLE "OAuthToken" ADD COLUMN     "oramaIndex" JSONB DEFAULT '{}',
ADD COLUMN     "synced" BOOLEAN NOT NULL DEFAULT false;
