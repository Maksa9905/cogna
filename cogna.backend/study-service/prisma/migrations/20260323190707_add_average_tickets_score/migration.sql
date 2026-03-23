/*
  Warnings:

  - You are about to drop the column `avrage_tickets_score` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `total_attempts` on the `subject_progress` table. All the data in the column will be lost.
  - You are about to drop the column `total_tickets` on the `subject_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subject_progress" DROP COLUMN "avrage_tickets_score",
DROP COLUMN "total_attempts",
DROP COLUMN "total_tickets",
ADD COLUMN     "average_tickets_score" DOUBLE PRECISION NOT NULL DEFAULT 0;
