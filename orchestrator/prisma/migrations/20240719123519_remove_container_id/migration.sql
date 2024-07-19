/*
  Warnings:

  - You are about to drop the column `containerId` on the `codebox` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_codebox" (
    "codeboxid" TEXT NOT NULL PRIMARY KEY,
    "containerName" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_codebox" ("codeboxid", "containerName", "language", "status") SELECT "codeboxid", "containerName", "language", "status" FROM "codebox";
DROP TABLE "codebox";
ALTER TABLE "new_codebox" RENAME TO "codebox";
CREATE UNIQUE INDEX "codebox_codeboxid_key" ON "codebox"("codeboxid");
CREATE UNIQUE INDEX "codebox_containerName_key" ON "codebox"("containerName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
