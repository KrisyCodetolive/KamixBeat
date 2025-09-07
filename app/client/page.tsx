//import { useState } from "react";
import { LicenseDialog } from "@/components/licenceDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Share2, Download } from "lucide-react";

// interface InstrumentalProps {
//   cover: string;
//   title: string;
//   bpm: string;
//   gamme: string;
// }

export default function InstrumentalInterface() {
  //const [comment, setComment] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 bg-white shadow rounded-lg">
      {/* Cover */}
      <img
        src="http://localhost:3003/uploads/instrumentals/[FREE]%20Didi%20b%20-%20Type%20Beat%202025%20CONSPIRATION1756188647612/Affiche-Didib.png"
        alt="COVER"
        className="w-full h-64 object-cover rounded-lg shadow"
      />

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">OUBLIER</h1>
        <p className="text-gray-600">BPM: 1000</p>
        <p className="text-gray-600">Gamme: Am</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <LicenseDialog>
          <Button variant="default" className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Télécharger
          </Button>
        </LicenseDialog>

        <Button variant="ghost" className="flex items-center gap-1">
          <Heart className="w-5 h-5" />
          Like
        </Button>
        <Button variant="ghost" className="flex items-center gap-1">
          <Share2 className="w-5 h-5" />
          Partager
        </Button>
      </div>

      {/* Commentaire */}
      <div className="flex flex-col gap-2">
        <label htmlFor="comment" className="text-sm font-medium text-gray-700">
          Laisser un commentaire
        </label>
        <Input
          id="comment"
          type="text"
          placeholder="Écrire un commentaire..."
        />
        <Button variant="default">Envoyer</Button>
      </div>
    </div>
  );
}
