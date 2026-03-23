/*
  Warnings:

  - You are about to drop the column `average_score` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `best_score` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `last_attempt_at` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `mastered_tickets` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `passed_attempts` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `total_attempts` on the `subject_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subject_progress" DROP COLUMN "average_score",
DROP COLUMN "best_score",
DROP COLUMN "last_attempt_at",
DROP COLUMN "mastered_tickets",
DROP COLUMN "passed_attempts",
DROP COLUMN "total_attempts",
ADD COLUMN     "avrage_tickets_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "last_repetition_date" TIMESTAMP(3);
