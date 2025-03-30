-- CreateTable
CREATE TABLE "GoogleTask" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "listTitle" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleEmail" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "preprocessedBody" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "labels" TEXT[],
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncToken" (
    "id" TEXT NOT NULL,
    "taskListId" TEXT NOT NULL,
    "syncToken" TEXT NOT NULL,

    CONSTRAINT "SyncToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleWatch" (
    "id" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "GoogleWatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleTask_taskId_key" ON "GoogleTask"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleEmail_messageId_key" ON "GoogleEmail"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncToken_taskListId_key" ON "SyncToken"("taskListId");

-- AddForeignKey
ALTER TABLE "GoogleTask" ADD CONSTRAINT "GoogleTask_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleEmail" ADD CONSTRAINT "GoogleEmail_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
