/*
  Warnings:

  - Changed the type of `importance` on the `theses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Importance" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "theses" DROP COLUMN "importance",
ADD COLUMN     "importance" "Importance" NOT NULL;
