-- Add VENDOR to ContactTopic enum and structured details JSON column to ContactMessage
ALTER TYPE "ContactTopic" ADD VALUE IF NOT EXISTS 'VENDOR';

ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "details" JSONB;

-- Migrate existing vendor applications tagged with [VENDOR APPLICATION] prefix
UPDATE "ContactMessage"
SET "topic" = 'VENDOR',
    "message" = TRIM(REGEXP_REPLACE("message", '^\[VENDOR APPLICATION\]\s*', ''))
WHERE "message" LIKE '[VENDOR APPLICATION]%';
