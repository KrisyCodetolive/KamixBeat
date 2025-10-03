import api from "@/lib/axios"

export async function getInstru(){
    try{
        const res = await api.get("api/Instrumentals")
        return res.data;

    }catch (error) {
        console.error("Erreur lors de la récupération :", error)
    }
    

}