// helper pour extraire le chemin relatif depuis une URL publique
export default function extractPathFromUrl(url: string ) {
  const parts = url.split("/object/public/instrumentals/");
  return parts[1] ?? "" ;
}