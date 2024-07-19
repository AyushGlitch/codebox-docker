-- CreateTable
CREATE TABLE "codebox" (
    "codeboxid" TEXT NOT NULL PRIMARY KEY,
    "containerName" TEXT NOT NULL,
    "containerId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "codebox_codeboxid_key" ON "codebox"("codeboxid");

-- CreateIndex
CREATE UNIQUE INDEX "codebox_containerName_key" ON "codebox"("containerName");
