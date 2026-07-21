/*
  Warnings:

  - You are about to drop the column `fileName` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileName",
ADD COLUMN     "etag" TEXT;

-- CreateIndex
CREATE INDEX "File_bucket_idx" ON "File"("bucket");
