/*
  Warnings:

  - Added the required column `roomId` to the `Danmu` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Danmu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "uname" TEXT NOT NULL,
    "badge" TEXT,
    "identity" TEXT,
    "raw" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "updateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Danmu" ("badge", "id", "identity", "messageId", "msg", "raw", "uid", "uname", "updateTime") SELECT "badge", "id", "identity", "messageId", "msg", "raw", "uid", "uname", "updateTime" FROM "Danmu";
DROP TABLE "Danmu";
ALTER TABLE "new_Danmu" RENAME TO "Danmu";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
