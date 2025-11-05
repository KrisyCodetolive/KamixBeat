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



//GET a instrumental
export async function GET(
  req: NextRequest
) {
  const { searchParams } = new URL(req.url);
  const Id = parseInt(searchParams.get("params")!);
  console.log(Id)

  if (isNaN(Id)) {
    return NextResponse.json(
      { error: "ID invalide" },
      { status: 400, headers }
    );
  }

  try {
    const Instru = await prisma.instrumental.findUnique({
      where: { instruId: Id },
      select: {
        instruId: true,
        title: true,
        bpm: true,
        gamme: true,
        cover: true,
        url: true,
      },
    });

    const Audio = await prisma.audioFile.findMany({
      where: { instrumentalId: Id },
      select: { price: true, path: true },
    });

    let Pathfiles: string[] = [];
    let SignedUrl:string[]=[]
    if (Instru && Audio.length > 0) {
      Pathfiles.push(decodeURIComponent(extractPathFromUrl(Instru.cover!)));
      Pathfiles.push(
        ...Audio.map((p) => decodeURIComponent(extractPathFromUrl(p.path)))
      );

      for (let files of Pathfiles) {
        const { data, error } = await supabase.storage
          .from("instrumentals")
          .createSignedUrl(files, 100);

        if (error) {
          console.error(error);
        } else {
          SignedUrl.push(data.signedUrl)
          //console.log(SignedUrl)
        
        }
      }
    }else{
          return NextResponse.json(
        { error: "Instrumental pas trouvé" },
        { status: 404, headers }
      );
    }
    return NextResponse.json(
      { Instru, Audio, SignedUrl },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Erreur GET instrumental:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500, headers }
    );
  }
}



//DELETE a instrumental
export async function DELETE(
  req: NextRequest
) {
const { searchParams } = new URL(req.url);
  const Id = parseFloat(searchParams.get("params")!);

  if (isNaN(Id)) {
    return NextResponse.json(
      { error: "ID invalide" },
      { status: 400, headers }
    );
  }

  // 1. Vérifier existence en BD
  const instrumental = await prisma.instrumental.findUnique({
    where: { instruId: Id },
    select: { cover: true },
  });

  if (!instrumental) {
    return NextResponse.json(
      { error: "Instrumental introuvable" },
      { status: 404 }
    );
  }

  // 2. Récupérer les fichiers audio associés
  const audioFiles = await prisma.audioFile.findMany({
    where: { instrumentalId: Id },
    select: { path: true },
  });

  // 3. Construire la liste des fichiers à supprimer
let Pathfiles: string[] = [];
  if (instrumental.cover)
    Pathfiles.push(extractPathFromUrl(instrumental.cover));
  Pathfiles.push(...audioFiles.map((a) => extractPathFromUrl(a.path)));

  // 4. Supprimer d’abord les fichiers du bucket
  const decodedPaths = Pathfiles.map((p) => decodeURIComponent(p));
  console.log("Paths envoyés à Supabase:", decodedPaths);
  if (Pathfiles.length > 0) {
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

  // 5. Supprimer les entrées en BD (cascade audioFiles si non configuré)
  try {
    await prisma.instrumental.delete({ where: { instruId: Id } });
  } catch (err: any) {
    console.error("Erreur suppression BD:", err.message);
    return NextResponse.json(
      { error: "Erreur lors de la suppression en BD" },
      { status: 500, headers }
    );
  }

  return NextResponse.json(
    { message: "Instrumental supprimé avec succès" },
    { status: 200, headers }
  );
}