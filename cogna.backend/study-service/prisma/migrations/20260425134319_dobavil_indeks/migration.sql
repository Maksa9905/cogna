-- DropIndex
DROP INDEX "ticket_attempts_ticket_id_idx";

-- DropIndex
DROP INDEX "ticket_attempts_user_id_idx";

-- CreateIndex
CREATE INDEX "ticket_attempts_user_id_ticket_id_idx" ON "ticket_attempts"("user_id", "ticket_id");
