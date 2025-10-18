"use client";
import { LicenseDialog } from "@/components/licenceDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instru } from "@/utils/Instru";
import { Heart, Share2, Download } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import React from "react";
import Loader from "@/components/Loader";
import MusicPlayer from "@/components/MusicPlayer"

export default function InstrumentalInterface({
   params,
}: {
  params: { id: string };
}) {
  const [instru, setInstru] = useState<Instru | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;
  console.log(id);

  // get Instru requête
  useEffect(() => {
    async function fetchInstruments() {
      try {
        const res = await api.get(`/api/Instrumentals/${id}`);
        console.log(res.data);
        setInstru(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstruments();
  }, [id]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  } else if (!instru) {
    return (
      <p className="text-center text-red-500">Instrumental non disponible</p>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 bg-white shadow rounded-lg">
      {/* Cover */}

      <div className="relative">
        <img
          src={instru.SignedUrl[0]}
          alt="COVER"
          className="w-full h-64 object-cover rounded-lg shadow"
        />
        <div className="absolute bottom-5 left-[50%] translate-x-[-50%]"> <MusicPlayer src={instru.SignedUrl[2]}/>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{instru.Instru.title}</h1>
        <p className="text-gray-600">BPM: {instru.Instru.bpm}</p>
        <p className="text-gray-600">Gamme: {instru.Instru.gamme}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <LicenseDialog Price={instru.Audio} id={id} title={instru.Instru.title}>
          <Button variant="default" className="flex items-center gap-2 w-full">
            <Download className="w-5 h-5" />
            Télécharger
          </Button>
        </LicenseDialog>
      </div>
    </div>
  );
}
