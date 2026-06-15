-- CreateTable
CREATE TABLE "HookType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "HookType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HookEmotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HookEmotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HookFormula" (
    "id" TEXT NOT NULL,
    "hookTypeId" TEXT NOT NULL,
    "formulaName" TEXT NOT NULL,
    "formulaTemplate" TEXT,
    "description" TEXT,

    CONSTRAINT "HookFormula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentHook" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "hookText" TEXT NOT NULL,
    "hookTypeId" TEXT,
    "formulaId" TEXT,
    "emotionId" TEXT,
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentHook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HookPerformance" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "hookTypeId" TEXT NOT NULL,
    "totalContents" INTEGER NOT NULL DEFAULT 0,
    "avgViews" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgRetention" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgEngagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgShares" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HookPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HookType_name_key" ON "HookType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HookEmotion_name_key" ON "HookEmotion"("name");

-- AddForeignKey
ALTER TABLE "HookFormula" ADD CONSTRAINT "HookFormula_hookTypeId_fkey" FOREIGN KEY ("hookTypeId") REFERENCES "HookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentHook" ADD CONSTRAINT "ContentHook_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentHook" ADD CONSTRAINT "ContentHook_hookTypeId_fkey" FOREIGN KEY ("hookTypeId") REFERENCES "HookType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentHook" ADD CONSTRAINT "ContentHook_formulaId_fkey" FOREIGN KEY ("formulaId") REFERENCES "HookFormula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentHook" ADD CONSTRAINT "ContentHook_emotionId_fkey" FOREIGN KEY ("emotionId") REFERENCES "HookEmotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HookPerformance" ADD CONSTRAINT "HookPerformance_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HookPerformance" ADD CONSTRAINT "HookPerformance_hookTypeId_fkey" FOREIGN KEY ("hookTypeId") REFERENCES "HookType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
