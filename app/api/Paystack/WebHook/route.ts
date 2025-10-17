import { NextResponse } from "next/server";

export async function POST(req: { json: () => any; }) {
  const body = await req.json();

  // Vérifie que c'est bien un événement de Paystack
  if (body.event === "charge.success") {
    const data = body.data;

    // Vérifie que le paiement est bien réussi
    if (data.status === "success") {
      console.log("✅ Paiement réussi :", data.reference);
      console.log("💰 Montant :", data.amount / 100, "NGN");
      console.log("📧 Email :", data.customer.email);

      // Ici tu peux enregistrer la transaction dans ta base de données
      // ou activer une licence, envoyer un mail, etc.
    }
  }

  // Toujours renvoyer un statut 200 à Paystack
  return NextResponse.json({ received: true }, { status: 200 });
}
