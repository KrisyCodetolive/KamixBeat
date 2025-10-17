import { NextResponse, NextRequest } from "next/server";
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

//get pass-word
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); 
  const password = searchParams.get("Password");

  if (!password) {
    return NextResponse.json(
      { error: "Paramètre 'password' manquant" },
      { status: 400 }
    );
  }

  if (password === process.env.PASSWORD) {
    return NextResponse.json(
      { success: true, message: "Authentification réussie" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: false, error: "Mot de passe incorrect" },
    { status: 401 }
  );
}


