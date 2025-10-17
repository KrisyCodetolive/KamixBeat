import axios from "axios";

export async function POST(req: { json: () => PromiseLike<{ email: any; amount: any; }> | { email: any; amount: any; }; }) {
  try {
    const { email, amount } = await req.json();

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.data)
    return Response.json(response.data.data);
  } catch (error: any) {
    console.error("Erreur Paystack:", error.response?.data || error.message);
    return Response.json({ error: "Erreur d'initialisation du paiement" }, { status: 500 });
  }
}
