/*
  Warnings:

  - You are about to drop the column `last_attempt_at` on the `ticket_progress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ticket_progress" DROP COLUMN "last_attempt_at";
