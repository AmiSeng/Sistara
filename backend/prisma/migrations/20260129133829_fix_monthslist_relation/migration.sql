/*
  Warnings:

  - You are about to drop the column `phase` on the `Course` table. All the data in the column will be lost.
  - Added the required column `phaseId` to the `Month` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PhaseName" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- DropForeignKey
ALTER TABLE "Month" DROP CONSTRAINT "Month_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "phase";

-- AlterTable
ALTER TABLE "Month" ADD COLUMN     "phaseId" INTEGER NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL;

-- DropEnum
DROP TYPE "Phase";

-- CreateTable
CREATE TABLE "Phase" (
    "id" SERIAL NOT NULL,
    "name" "PhaseName" NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Phase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Phase" ADD CONSTRAINT "Phase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Month" ADD CONSTRAINT "Month_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
