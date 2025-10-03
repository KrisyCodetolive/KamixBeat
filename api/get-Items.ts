import api from "@/lib/axios"

export async function getItems(id:number){
    try{
        const res = await api.get(`get-instru/${id}`)
        return res;

    }catch (error) {
        console.error("Erreur lors de la récupération :", error)
    }
    

}
//Krisy225