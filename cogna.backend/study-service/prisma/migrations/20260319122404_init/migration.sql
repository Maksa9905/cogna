-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'STUDIED', 'MASTERED');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AttemptType" AS ENUM ('PRACTICE', 'EXAM', 'TEST', 'REVIEW', 'TIMED');

-- CreateTable
CREATE TABLE "ticket_attempts" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rawScore" TEXT NOT NULL,
    "summary" TEXT,
    "time_spent" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_progress" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "best_score" DOUBLE PRECISION NOT NULL,
    "last_score" DOUBLE PRECISION NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "last_attempt_at" TIMESTAMP(3),
    "status" "TicketStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'MEDIUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_attempts" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_tickets" INTEGER NOT NULL,
    "answered_tickets" INTEGER NOT NULL DEFAULT 0,
    "correct_tickets" INTEGER NOT NULL DEFAULT 0,
    "total_score" DOUBLE PRECISION NOT NULL,
    "average_score" DOUBLE PRECISION NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "time_spent" INTEGER,
    "passed" BOOLEAN,
    "grade" TEXT,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "type" "AttemptType" NOT NULL DEFAULT 'PRACTICE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_progress" (
    "id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_tickets" INTEGER NOT NULL DEFAULT 0,
    "studied_tickets" INTEGER NOT NULL DEFAULT 0,
    "mastered_tickets" INTEGER NOT NULL DEFAULT 0,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "passed_attempts" INTEGER NOT NULL DEFAULT 0,
    "average_score" DOUBLE PRECISION NOT NULL,
    "best_score" DOUBLE PRECISION NOT NULL,
    "last_attempt_at" TIMESTAMP(3),
    "total_time_spent" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_attempts_ticket_id_idx" ON "ticket_attempts"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_attempts_user_id_idx" ON "ticket_attempts"("user_id");

-- CreateIndex
CREATE INDEX "ticket_attempts_subject_id_idx" ON "ticket_attempts"("subject_id");

-- CreateIndex
CREATE INDEX "ticket_attempts_created_at_idx" ON "ticket_attempts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_progress_ticket_id_key" ON "ticket_progress"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_progress_user_id_idx" ON "ticket_progress"("user_id");

-- CreateIndex
CREATE INDEX "ticket_progress_subject_id_idx" ON "ticket_progress"("subject_id");

-- CreateIndex
CREATE INDEX "ticket_progress_status_idx" ON "ticket_progress"("status");

-- CreateIndex
CREATE INDEX "subject_attempts_subject_id_idx" ON "subject_attempts"("subject_id");

-- CreateIndex
CREATE INDEX "subject_attempts_user_id_idx" ON "subject_attempts"("user_id");

-- CreateIndex
CREATE INDEX "subject_attempts_status_idx" ON "subject_attempts"("status");

-- CreateIndex
CREATE INDEX "subject_attempts_start_time_idx" ON "subject_attempts"("start_time");

-- CreateIndex
CREATE UNIQUE INDEX "subject_progress_subject_id_key" ON "subject_progress"("subject_id");

-- CreateIndex
CREATE INDEX "subject_progress_user_id_idx" ON "subject_progress"("user_id");
