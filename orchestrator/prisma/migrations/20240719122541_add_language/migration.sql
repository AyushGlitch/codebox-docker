/*
  Warnings:

  - Added the required column `language` to the `codebox` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_codebox" (
    "codeboxid" TEXT NOT NULL PRIMARY KEY,
    "containerName" TEXT NOT NULL,
    "containerId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_codebox" ("codeboxid", "containerId", "containerName", "status") SELECT "codeboxid", "containerId", "containerName", "status" FROM "codebox";
DROP TABLE "codebox";
ALTER TABLE "new_codebox" RENAME TO "codebox";
CREATE UNIQUE INDEX "codebox_codeboxid_key" ON "codebox"("codeboxid");
CREATE UNIQUE INDEX "codebox_containerName_key" ON "codebox"("containerName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
