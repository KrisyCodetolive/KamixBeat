-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('mp3', 'zip');

-- CreateTable
CREATE TABLE "public"."Instrumental" (
    "instruId" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "bpm" TEXT NOT NULL,
    "gamme" VARCHAR(10) NOT NULL,
    "directory" TEXT NOT NULL,
    "cover" TEXT,
    "url" TEXT NOT NULL DEFAULT '/path/to/instru',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Instrumental_pkey" PRIMARY KEY ("instruId")
);

-- CreateTable
CREATE TABLE "public"."AudioFile" (
    "id" SERIAL NOT NULL,
    "type" "public"."FileType" NOT NULL,
    "path" TEXT NOT NULL,
    "price" TEXT NOT NULL DEFAULT 'null',
    "instrumentalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instrumental_title_key" ON "public"."Instrumental"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumental_directory_key" ON "public"."Instrumental"("directory");

-- CreateIndex
CREATE UNIQUE INDEX "Instrumental_cover_key" ON "public"."Instrumental"("cover");

-- CreateIndex
CREATE UNIQUE INDEX "AudioFile_path_key" ON "public"."AudioFile"("path");

-- AddForeignKey
ALTER TABLE "public"."AudioFile" ADD CONSTRAINT "AudioFile_instrumentalId_fkey" FOREIGN KEY ("instrumentalId") REFERENCES "public"."Instrumental"("instruId") ON DELETE CASCADE ON UPDATE CASCADE;
