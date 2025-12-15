/*
  Warnings:

  - You are about to drop the column `userId` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `MonitorRun` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Monitor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_monitorId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- DropForeignKey
ALTER TABLE "Integration" DROP CONSTRAINT "Integration_userId_fkey";

-- DropForeignKey
ALTER TABLE "Monitor" DROP CONSTRAINT "Monitor_userId_fkey";

-- DropForeignKey
ALTER TABLE "MonitorRun" DROP CONSTRAINT "MonitorRun_monitorId_fkey";

-- DropForeignKey
ALTER TABLE "Postmortem" DROP CONSTRAINT "Postmortem_monitorId_fkey";

-- DropForeignKey
ALTER TABLE "Postmortem" DROP CONSTRAINT "Postmortem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- CreateTable (moved before AlterTable to create projects first)
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- AddForeignKey for Project (add this early)
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data Migration: Create a default project for each user that has monitors
INSERT INTO "Project" ("id", "userId", "name", "description", "createdAt", "updatedAt")
SELECT 
    'default_' || "userId", 
    "userId", 
    'Default Project', 
    'Auto-created during migration', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
FROM "Monitor"
GROUP BY "userId";

-- AlterTable: Add projectId column (nullable first)
ALTER TABLE "Monitor" ADD COLUMN "projectId" TEXT;

-- Update existing monitors to use the default project
UPDATE "Monitor" 
SET "projectId" = 'default_' || "userId";

-- Now make projectId required and drop userId
ALTER TABLE "Monitor" ALTER COLUMN "projectId" SET NOT NULL;
ALTER TABLE "Monitor" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "MonitorRun" DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_monitorId_idx" ON "Alert"("monitorId");

-- CreateIndex
CREATE INDEX "Integration_userId_idx" ON "Integration"("userId");

-- CreateIndex
CREATE INDEX "Monitor_projectId_idx" ON "Monitor"("projectId");

-- CreateIndex
CREATE INDEX "Monitor_isActive_idx" ON "Monitor"("isActive");

-- CreateIndex
CREATE INDEX "MonitorRun_monitorId_idx" ON "MonitorRun"("monitorId");

-- CreateIndex
CREATE INDEX "MonitorRun_createdAt_idx" ON "MonitorRun"("createdAt");

-- CreateIndex
CREATE INDEX "Postmortem_monitorId_idx" ON "Postmortem"("monitorId");

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonitorRun" ADD CONSTRAINT "MonitorRun_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postmortem" ADD CONSTRAINT "Postmortem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postmortem" ADD CONSTRAINT "Postmortem_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
