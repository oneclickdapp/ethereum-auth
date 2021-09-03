-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "authDetailId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthDetail" (
    "id" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.address_unique" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_authDetailId_unique" ON "User"("authDetailId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("authDetailId") REFERENCES "AuthDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
