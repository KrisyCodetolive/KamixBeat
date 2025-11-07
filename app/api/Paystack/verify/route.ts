import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import extractPathFromUrl from "@/utils/extractPath";
import { createClient } from "@supabase/supabase-js";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers });
}

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { params, reference, type, email } = await req.json();
    if (!params) {
      console.log("Paramètre 'params' manquant")
      return NextResponse.json(
        { error: "Paramètre 'params' manquant" },
        { status: 400, headers }
      );
    }

    // 🔍 Récupérer les fichiers audio liés à l'instru
    const Audio = await prisma.audioFile.findMany({
      where: { instrumentalId: parseInt(params) },
      select: { path: true, price: true },
    });

    const Instru = await prisma.instrumental.findFirst({
      where: { instruId: parseInt(params) },
      select: { title: true },
    });

    if (!Instru) {
      return NextResponse.json(
        { error: "Instrumental introuvable" },
        { status: 404, headers }
      );
    }

    if (!Audio || Audio.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier audio trouvé pour cet instrumental" },
        { status: 404, headers }
      );
    }

    // 🔏 Fonction pour créer un lien signé Supabase
    const createSignedUrl = async (filePath: string) => {
      const decodedPath = decodeURIComponent(extractPathFromUrl(filePath));
      const { data, error } = await supabase.storage
        .from("instrumentals")
        .createSignedUrl(decodedPath, 100); // 100 secondes de validité

      if (error) throw new Error("Erreur Supabase : " + error.message);
      return data.signedUrl;
    };

    // 🆓 Téléchargement gratuit
    if (reference === "0") {
      const signedUrls = await Promise.all(
        Audio.map((a) => createSignedUrl(a.path))
      );

      const selectedUrl = type === "Free" ? signedUrls[0] : signedUrls[1] ?? null;

      if (!selectedUrl) {
        return NextResponse.json(
          { error: "Aucun lien valide trouvé pour ce type" },
          { status: 400, headers }
        );
      }

      await prisma.achatClientPreview.create({
        data: {
          client: email,
          instrumental: Instru.title,
          licence: "FREE",
          prix: Audio[0].price,
        },
      });

      return NextResponse.json(
        { signedUrl: selectedUrl },
        { status: 200, headers }
      );
    }

    // 💳 Vérification Paystack
    const secret = process.env.PAYSTACK_TEST_KEY!;
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await verifyRes.json();

    if (result.data?.status === "success") {
      const paidFile = Audio[1];
      const signedUrl = await createSignedUrl(paidFile.path);

      await prisma.achatClientPreview.create({
        data: {
          client: email,
          instrumental: Instru.title,
          licence: "STANDARD",
          prix: Audio[1].price,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "✅ Paiement validé avec succès",
          signedUrl,
        },
        { status: 200, headers }
      );
    }

    // ❌ Paiement non confirmé
    return NextResponse.json(
      { success: false, message: "❌ Paiement non confirmé" },
      { status: 400, headers }
    );
  } catch (err: any) {
    console.error("Erreur API:", err);
    return NextResponse.json(
      { error: err.message || "Erreur interne du serveur" },
      { status: 500, headers }
    );
  }
}
