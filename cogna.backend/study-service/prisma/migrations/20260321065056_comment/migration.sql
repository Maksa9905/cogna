/*
  Warnings:

  - You are about to drop the column `end_time` on the `subject_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `subject_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `subject_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `subject_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `time_spent` on the `subject_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `subject_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `total_time_spent` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `ticket_progress` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ticket_progress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,subject_id]` on the table `subject_progress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,ticket_id]` on the table `ticket_progress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "subject_attempts_start_time_idx";

-- DropIndex
DROP INDEX "subject_attempts_status_idx";

-- DropIndex
DROP INDEX "subject_progress_subject_id_key";

-- DropIndex
DROP INDEX "ticket_progress_status_idx";

-- DropIndex
DROP INDEX "ticket_progress_ticket_id_key";

-- AlterTable
ALTER TABLE "subject_attempts" DROP COLUMN "end_time",
DROP COLUMN "grade",
DROP COLUMN "start_time",
DROP COLUMN "status",
DROP COLUMN "time_spent",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "subject_progress" DROP COLUMN "total_time_spent";

-- AlterTable
ALTER TABLE "ticket_progress" DROP COLUMN "confidence",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "AttemptStatus";

-- DropEnum
DROP TYPE "AttemptType";

-- DropEnum
DROP TYPE "ConfidenceLevel";

-- DropEnum
DROP TYPE "TicketStatus";

-- CreateIndex
CREATE UNIQUE INDEX "subject_progress_user_id_subject_id_key" ON "subject_progress"("user_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_progress_user_id_ticket_id_key" ON "ticket_progress"("user_id", "ticket_id");
