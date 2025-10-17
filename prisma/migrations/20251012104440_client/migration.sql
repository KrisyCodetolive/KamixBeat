-- CreateEnum
CREATE TYPE "public"."ClientType" AS ENUM ('ARTISTE', 'BEATMAKER');

-- CreateEnum
CREATE TYPE "public"."LicenceType" AS ENUM ('FREE', 'STANDARD', 'PREMIUM');

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "public"."ClientType" NOT NULL,
    "numero" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accord" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AchatClient" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "instrumentalId" INTEGER NOT NULL,
    "prix" TEXT NOT NULL,
    "licence" "public"."LicenceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchatClient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AchatClient" ADD CONSTRAINT "AchatClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AchatClient" ADD CONSTRAINT "AchatClient_instrumentalId_fkey" FOREIGN KEY ("instrumentalId") REFERENCES "public"."Instrumental"("instruId") ON DELETE RESTRICT ON UPDATE CASCADE;
