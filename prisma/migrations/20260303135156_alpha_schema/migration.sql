-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "googleId" TEXT,
    "businessUrl" TEXT,
    "socialLinks" TEXT,
    "businessDescription" TEXT,
    "businessType" TEXT NOT NULL DEFAULT 'unknown',
    "hoursAvailablePerWeek" INTEGER NOT NULL DEFAULT 40,
    "weeklyRevenueBaselineCents" INTEGER NOT NULL DEFAULT 0,
    "targetMonthlyIncomeCents" INTEGER NOT NULL DEFAULT 300000,
    "targetMaxHoursPerWeek" INTEGER NOT NULL DEFAULT 35,
    "consistencyWindowMonths" INTEGER NOT NULL DEFAULT 6,
    "fullLoggingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "commandMode" BOOLEAN NOT NULL DEFAULT true,
    "openAiApiKeyEncrypted" TEXT,
    "openAiKeyLast4" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyRevenue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "revenueCents" INTEGER NOT NULL,
    "trafficSessions" INTEGER,
    "leadsGenerated" INTEGER,
    "closedSales" INTEGER,
    "churnedCustomers" INTEGER,
    "grossMarginPct" REAL,
    "note" TEXT,
    "strategyTriggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WeeklyRevenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "selectedLever" TEXT NOT NULL,
    "reasoningSummary" TEXT NOT NULL,
    "growthStatus" TEXT NOT NULL,
    "executionStatus" TEXT NOT NULL,
    "driftStatus" TEXT NOT NULL,
    "leverChangeRecommended" BOOLEAN NOT NULL,
    "allocationAdjustment" TEXT NOT NULL,
    "manualOverride" BOOLEAN NOT NULL DEFAULT false,
    "overrideReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkLogSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "minutes" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkLogSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FreedomDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "targetMonthlyIncomeCents" INTEGER NOT NULL DEFAULT 300000,
    "targetMaxHoursPerWeek" INTEGER NOT NULL DEFAULT 35,
    "consistencyWindowMonths" INTEGER NOT NULL DEFAULT 6,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FreedomDefinition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyMission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "lever" TEXT NOT NULL,
    "primaryTask" TEXT NOT NULL,
    "supportTask" TEXT,
    "doNotDoReminder" TEXT NOT NULL,
    "recommendedMinutes" INTEGER NOT NULL,
    "startNowStep" TEXT NOT NULL,
    "successDefinition" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'TEMPLATE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyMission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PauseWindow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PauseWindow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "WeeklyRevenue_userId_weekStart_idx" ON "WeeklyRevenue"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyRevenue_userId_weekStart_key" ON "WeeklyRevenue"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "WeeklyPlan_userId_weekStart_idx" ON "WeeklyPlan"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPlan_userId_weekStart_key" ON "WeeklyPlan"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "WorkLogSession_userId_date_idx" ON "WorkLogSession"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FreedomDefinition_userId_key" ON "FreedomDefinition"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyMission_userId_date_key" ON "DailyMission"("userId", "date");

-- CreateIndex
CREATE INDEX "PauseWindow_userId_isActive_idx" ON "PauseWindow"("userId", "isActive");
