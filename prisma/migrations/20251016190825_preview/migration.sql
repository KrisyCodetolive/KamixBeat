-- CreateTable
CREATE TABLE "public"."AchatClientPreview" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,
    "instrumental" TEXT NOT NULL,
    "licence" "public"."LicenceType" NOT NULL,
    "prix" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AchatClientPreview_pkey" PRIMARY KEY ("id")
);
