-- AddForeignKey
ALTER TABLE "ticket_progress" ADD CONSTRAINT "ticket_progress_user_id_subject_id_fkey" FOREIGN KEY ("user_id", "subject_id") REFERENCES "subject_progress"("user_id", "subject_id") ON DELETE CASCADE ON UPDATE CASCADE;
