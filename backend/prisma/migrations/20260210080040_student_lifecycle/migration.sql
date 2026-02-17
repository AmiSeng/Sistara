/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentPhase" "PhaseName" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "specialization" "CourseType",
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
