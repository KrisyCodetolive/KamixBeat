import Axios from "@/lib/axios"



export default async function addInstru(Data:FormData ){

    try{
         const res = await Axios.post("api/Instrumentals" , Data ,{
            headers: { "Content-Type": "multipart/form-data" }});
        console.log('reponse:', res);
        return res;
    
}catch (error){
        console.log('erreur:', error);
        return error;
}

}


