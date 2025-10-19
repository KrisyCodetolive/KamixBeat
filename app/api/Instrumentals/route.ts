import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import extractPathFromUrl from "@/utils/extractPath";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Réponse CORS pour les preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers });
}

//connect BD
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
type FileType = "mp3" | "zip" | "png" | "jpg";

//get instrument
export async function GET() {
  try {
    const instrus = await prisma.instrumental.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(instrus, { headers });
  } catch (error) {
    console.error("Erreur récupération instrus:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les instrus" },
      { status: 500 }
    );
  }
}

//add instrument
export async function POST(req: NextRequest) {
  try {
    // Get FormData
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const bpm = formData.get("bpm") as string;
    const gamme = formData.get("gamme") as string;
    const cover = formData.get("cover") as File | null;
    const preview = formData.get("preview") as File | null;
    const full = formData.get("full") as File | null;
    const project = formData.get("project") as File | null;
    const priceString = formData.get("prices") as string;
    const price: string[] = JSON.parse(priceString);
    console.log(price);
    //Audio list
    const Files: File[] = [cover, preview, full, project].filter(
      Boolean
    ) as File[];

    // validate data
    if (!title || !bpm || !gamme || price.length === 0 || Files.length === 0) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400, headers }
      );
    }

    //Check if an instrumental with the same title already exists
    const existingInstru = await prisma.instrumental.findFirst({
      where: {
        title: title,
      },
    });

    if (existingInstru) {
      console.log("Une instrumental avec ce titre existe déjà");
      return NextResponse.json(
        { error: "Une instrumental avec ce titre existe déjà" },
        { status: 400, headers }
      );
    }

    // create a unique "folder" for the instrumental
    const instruFolder = `beat_${Date.now()}`;

    // Upload file
    const uploadedFiles: string[] = [];
    const fileInfo: any[] = [];
    let countId: number = 0;
    
    for (const file of Files) {
      const { data, error } = await supabase.storage
        .from("instrumentals")
        .upload(`${instruFolder}/${file.name}`, file);

      if (error) {
        // rollback si échec
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
        price: countId == 0  ? "0" : price[countId-1],
      });
      countId++;
    
      
    }

    // save data
    try {
      const instru = await prisma.$transaction(async (tx) => {
        // 1. Create instru
        const createdInstru = await tx.instrumental.create({
          data: {
            title,
            bpm,
            gamme,
            directory: instruFolder,
            cover: fileInfo[0].path,
          },
        });

        // 2. Create file audio
        for (const audio of fileInfo) {
          if (audio.type === "png"|| audio.type ==="jpg") continue;

          await tx.audioFile.create({
            data: {
              type: audio.type,
              path: audio.path,
              price: audio.price,
              instrumentalId: createdInstru.instruId,
            },
          });
        }

        return createdInstru; // retourne l'instru si tout réussit
      });

      //succefull
      return NextResponse.json(instru, { status: 201, headers });
    } catch (err: any) {
      console.error("DB transaction failed:", err);

      // Rollback
      try {
        const pathsToDelete = uploadedFiles.map((path) => path);
        await supabase.storage.from("instrumentals").remove(pathsToDelete);
        console.log("Rollback storage done:", pathsToDelete);
      } catch (storageErr) {
        console.error("Failed to rollback storage:", storageErr);
      }

      //return error
      return NextResponse.json(
        {
          error:
            "Échec lors de l'ajout des données vérifier bien les informations ou contactez le créateur",
        },
        { status: 500, headers }
      );
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({
      error:
        "Oupps, une erreur est survenue veillez réessayer ou contactez le créateur",
      headers,
    });
  }
}

//del instrument
export async function DELETE() {
  const FileToDelete: string[] = [];

  try{


    //get path file
    const pathCover = await prisma.instrumental.findMany({
        select: { cover: true },
    });

    const pathAudio = await prisma.audioFile.findMany({
        select: { path: true },
    });


    //add in list FileToDelete
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


  //delete BD 
  await prisma.instrumental.deleteMany();

  //delete file to bucket 
  const decodedPaths = FileToDelete.map(p => decodeURIComponent(p));
  console.log("Paths envoyés à Supabase:", decodedPaths);
  if (FileToDelete.length > 0) {
    const { error: bucketError } = await supabase.storage
      .from("instrumentals")
      .remove(decodedPaths);

    if (bucketError) {
      console.error("Erreur Supabase remove:", bucketError.message);
      return NextResponse.json(
        { error: "Erreur lors de la suppression des fichiers" },
        { status: 500, headers }
      );
    }
  }

  }
  catch (err: any) {
    console.error("Erreur suppression BD:", err.message);
    return NextResponse.json({ error: "Erreur lors de la suppression en BD" }, { status: 500, headers });
  }
 
  return NextResponse.json({ message: "Tous les instrumentals ont été supprimé avec succès" }, { status: 200, headers });
}


