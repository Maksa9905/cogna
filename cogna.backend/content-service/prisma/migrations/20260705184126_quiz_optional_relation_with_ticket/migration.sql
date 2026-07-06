-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_ticket_id_fkey";

-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "ticket_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
