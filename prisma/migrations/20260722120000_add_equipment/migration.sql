-- CreateEnum
CREATE TYPE "EquipmentCategory" AS ENUM ('laptop', 'pc', 'monitor', 'biurko', 'fotel');

-- CreateEnum
CREATE TYPE "EquipmentStockSource" AS ENUM ('seed', 'sheet', 'manual');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "category" "EquipmentCategory" NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cardImage" TEXT NOT NULL,
    "specs" JSONB NOT NULL,
    "cardSpecs" JSONB,
    "monthlyPrice" INTEGER,
    "units" INTEGER NOT NULL DEFAULT 0,
    "stockSource" "EquipmentStockSource" NOT NULL DEFAULT 'seed',
    "stockSyncedAt" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Equipment_category_idx" ON "Equipment"("category");

-- CreateIndex
CREATE INDEX "Equipment_active_idx" ON "Equipment"("active");
