-- CreateTable
CREATE TABLE "Danmu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "msg" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "uname" TEXT NOT NULL,
    "badge" TEXT,
    "identity" TEXT,
    "raw" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
