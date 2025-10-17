import { NextResponse} from "next/server";
import prisma from "@/lib/prisma";


const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Réponse CORS pour les preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers });
}



//get instrument
export async function GET() {
  try {
    const instrus = await prisma.achatClientPreview.findMany({
      orderBy: { id: "desc" },
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