'use client';

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Axios from "axios";
import { useRouter } from "next/navigation";

export default function PasswordInput() {
  const [Password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!Password) {
      setError("Veuillez entrer votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const res = await Axios.get(`/api/Users`, {  params: { Password }  });

      if (res.status === 200 && res.data?.success) {
        // 🔑 Stockage de la clé dans localStorage
        localStorage.setItem("auth_key", "connected"); 
        router.push(`${window.location.origin}/admin/dashbord`);
      } else {
        setError(res.data?.message || "Mot de passe incorrect.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>

        <div className="mb-4">
          <Label htmlFor="password" className="mb-1 text-sm font-medium block">
            Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Entrez le mot de passe pour vous connecter"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
