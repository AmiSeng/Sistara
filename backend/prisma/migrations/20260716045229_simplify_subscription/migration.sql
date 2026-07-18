/*
  Warnings:

  - You are about to drop the column `cohortId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `monthId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,courseId,month]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `courseId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_cohortId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_monthId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_monthId_cohortId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "cohortId",
DROP COLUMN "monthId",
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "courseId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_courseId_month_key" ON "Subscription"("userId", "courseId", "month");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
