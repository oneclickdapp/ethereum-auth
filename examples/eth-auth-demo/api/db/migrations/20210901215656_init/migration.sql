-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "authDetailId" TEXT NOT NULL,
    FOREIGN KEY ("authDetailId") REFERENCES "AuthDetail" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuthDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nonce" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User.address_unique" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_authDetailId_unique" ON "User"("authDetailId");
