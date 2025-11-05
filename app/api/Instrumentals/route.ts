import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import extractPathFromUrl from "@/utils/extractPath";

// ⚙️ Configuration CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ Réponse CORS pour les preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// ⚙️ Supabase client (clé service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type FileType = "mp3" | "zip" | "png" | "jpg";

// ✅ GET — Récupération des instrumentaux
export async function GET() {
  try {
    const instrus = await prisma.instrumental.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(instrus, { headers: corsHeaders });
  } catch (error) {
    console.error("Erreur récupération instrus:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les instrus" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ POST — Ajout d’un instrumental
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const bpm = formData.get("bpm") as string;
    const gamme = formData.get("gamme") as string;
    const cover = formData.get("cover") as File | null;
    const preview = formData.get("preview") as File | null;
    const full = formData.get("full") as File | null;
    const priceString = formData.get("prices") as string;
    const price: string[] = JSON.parse(priceString);

    // Validation
    const Files: File[] = [cover, preview, full].filter(Boolean) as File[];
    if (!title || !bpm || !gamme || price.length === 0 || Files.length === 0) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Vérification de doublon
    const existingInstru = await prisma.instrumental.findFirst({
      where: { title },
    });
    if (existingInstru) {
      return NextResponse.json(
        { error: "Une instrumental avec ce titre existe déjà" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Création du dossier unique
    const instruFolder = `beat_${Date.now()}`;

    // Upload fichiers
    const uploadedFiles: string[] = [];
    const fileInfo: any[] = [];
    let countId = 0;

    for (const file of Files) {
      // Conversion du fichier → Buffer (nécessaire sur Vercel)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from("instrumentals")
        .upload(`${instruFolder}/${file.name}`, buffer, {
          contentType: file.type,
        });

      if (error) {
        // rollback si échec upload
        for (const path of uploadedFiles) {
          await supabase.storage.from("instrumentals").remove([path]);
        }
        console.error("Upload error:", error);
        throw new Error(`Échec de l'upload fichier: ${file.name}`);
      }

      uploadedFiles.push(`${instruFolder}/${file.name}`);

      fileInfo.push({
        type: file.name.split(".").pop() as FileType,
        path: supabase.storage
          .from("instrumentals")
          .getPublicUrl(`${instruFolder}/${file.name}`).data.publicUrl,
        price: countId === 0 ? "0" : price[countId - 1],
      });
      countId++;
    }

    // Sauvegarde BDD
    try {
      const instru = await prisma.$transaction(async (tx) => {
        const createdInstru = await tx.instrumental.create({
          data: {
            title,
            bpm,
            gamme,
            directory: instruFolder,
            cover: fileInfo[0].path,
          },
        });

        for (const audio of fileInfo) {
          if (audio.type === "png" || audio.type === "jpg") continue;

          await tx.audioFile.create({
            data: {
              type: audio.type,
              path: audio.path,
              price: audio.price,
              instrumentalId: createdInstru.instruId,
            },
          });
        }

        return createdInstru;
      });

      return NextResponse.json(instru, { status: 201, headers: corsHeaders });
    } catch (err: any) {
      console.error("DB transaction failed:", err);

      // rollback storage si échec
      try {
        await supabase.storage
          .from("instrumentals")
          .remove(uploadedFiles.map((path) => path));
      } catch (storageErr) {
        console.error("Rollback storage error:", storageErr);
      }

      return NextResponse.json(
        {
          error:
            "Échec lors de l'ajout des données. Vérifie bien les informations ou contacte le créateur.",
        },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (err: any) {
    console.error("Erreur générale POST:", err);
    return NextResponse.json(
      {
        error:
          "Oupps, une erreur est survenue, veillez réessayer ou contactez le créateur.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// ✅ DELETE — Suppression de tous les instrumentaux
export async function DELETE() {
  const FileToDelete: string[] = [];

  try {
    const pathCover = await prisma.instrumental.findMany({
      select: { cover: true },
    });
    const pathAudio = await prisma.audioFile.findMany({
      select: { path: true },
    });

    // Construction de la liste à supprimer
    FileToDelete.push(
      ...pathCover
        .map((a) => a.cover)
        .filter((c): c is string => !!c)
        .map(extractPathFromUrl)
    );
    FileToDelete.push(
      ...pathAudio
        .map((a) => a.path)
        .filter((p): p is string => !!p)
        .map(extractPathFromUrl)
    );

    // Suppression BDD
    await prisma.instrumental.deleteMany();

    // Suppression fichiers Supabase
    const decodedPaths = FileToDelete.map((p) => decodeURIComponent(p));
    if (decodedPaths.length > 0) {
      const { error: bucketError } = await supabase.storage
        .from("instrumentals")
        .remove(decodedPaths);
      if (bucketError) {
        console.error("Erreur Supabase remove:", bucketError.message);
        return NextResponse.json(
          { error: "Erreur lors de la suppression des fichiers" },
          { status: 500, headers: corsHeaders }
        );
      }
    }
  } catch (err: any) {
    console.error("Erreur suppression BD:", err.message);
    return NextResponse.json(
      { error: "Erreur lors de la suppression en BD" },
      { status: 500, headers: corsHeaders }
    );
  }

  return NextResponse.json(
    { message: "Tous les instrumentals ont été supprimés avec succès" },
    { status: 200, headers: corsHeaders }
  );
}
