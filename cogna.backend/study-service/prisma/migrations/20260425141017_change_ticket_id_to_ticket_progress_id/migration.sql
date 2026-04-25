/*
  Warnings:

  - You are about to drop the column `subject_id` on the `ticket_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_id` on the `ticket_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ticket_attempts` table. All the data in the column will be lost.
  - Added the required column `ticket_progress_id` to the `ticket_attempts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ticket_attempts_subject_id_idx";

-- DropIndex
DROP INDEX "ticket_attempts_user_id_ticket_id_idx";

-- AlterTable
ALTER TABLE "ticket_attempts" DROP COLUMN "subject_id",
DROP COLUMN "ticket_id",
DROP COLUMN "user_id",
ADD COLUMN     "ticket_progress_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ticket_attempts_ticket_progress_id_idx" ON "ticket_attempts"("ticket_progress_id");

-- AddForeignKey
ALTER TABLE "ticket_attempts" ADD CONSTRAINT "ticket_attempts_ticket_progress_id_fkey" FOREIGN KEY ("ticket_progress_id") REFERENCES "ticket_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
