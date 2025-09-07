import api from "@/lib/axios"

export async function getInstru(){
    try{
        const res = await api.get("/instrumental/get-instru")
        return res;

    }catch (error) {
        console.error("Erreur lors de la récupération :", error)
    }
    

}