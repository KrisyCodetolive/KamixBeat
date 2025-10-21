import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, amount } = await req.json();

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { email, amount },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_KEY}`, 
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Initialization Data:", response.data.data);

    return NextResponse.json(response.data.data);
  } catch (error: any) {
    console.error("Erreur Paystack:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Erreur d'initialisation du paiement" },
      { status: 500 }
    );
  }
}
