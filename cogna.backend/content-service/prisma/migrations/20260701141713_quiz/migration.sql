/*
  Warnings:

  - You are about to drop the column `thesis_id` on the `quizzes` table. All the data in the column will be lost.
  - Added the required column `subject_id` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('OPEN', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE');

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_thesis_id_fkey";

-- DropIndex
DROP INDEX "quizzes_thesis_id_key";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "thesis_id",
ADD COLUMN     "reference_answer" TEXT,
ADD COLUMN     "subject_id" TEXT NOT NULL,
ADD COLUMN     "type" "QuestionType" NOT NULL;

-- CreateIndex
CREATE INDEX "quizzes_subject_id_idx" ON "quizzes"("subject_id");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
