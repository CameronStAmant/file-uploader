ALTER TABLE "File" ADD COLUMN     "mimetype" TEXT NOT NULL;
UPDATE "File" SET "mimetype" = 'image/png';
