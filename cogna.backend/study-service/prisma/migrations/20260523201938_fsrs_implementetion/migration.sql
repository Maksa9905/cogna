/*
  Warnings:

  - Added the required column `difficulty` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lapses` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_review` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_steps` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reps` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_days` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stability` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `ticket_progress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('NEW', 'LEARNING', 'REVIEW', 'RELEANING');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('MANUAL', 'AGAIN', 'HARD', 'GOOD', 'EASY');

-- AlterTable
ALTER TABLE "ticket_attempts" ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "due" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "elapsed_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_elapsed_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "learningSteps" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" "Rating" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "review" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "scheduled_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stability" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "state" "State" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "ticket_progress" ADD COLUMN     "difficulty" INTEGER NOT NULL,
ADD COLUMN     "due" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "elapsed_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lapses" INTEGER NOT NULL,
ADD COLUMN     "last_review" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "learning_steps" INTEGER NOT NULL,
ADD COLUMN     "reps" INTEGER NOT NULL,
ADD COLUMN     "schedule_days" INTEGER NOT NULL,
ADD COLUMN     "stability" INTEGER NOT NULL,
ADD COLUMN     "state" "State" NOT NULL;
