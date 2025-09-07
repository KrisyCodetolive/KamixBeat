import Axios from "@/lib/axios"



export async function delInstruAll(){

    try{
         const res = await Axios.delete("/del-instru");
        console.log('reponse:', res.data);
        return res.data;
    
}catch (error){

        console.log('erreur:', error);
        return error;
}

}

export async function delInstru(id:number){

    try{
         const res = await Axios.delete(`/del-instru/${id}`);
        console.log('reponse:', res.data);
        return res.data;
    
}catch (error){

        console.log('erreur:', error);
        return error;
}

}


