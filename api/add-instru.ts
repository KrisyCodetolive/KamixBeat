import Axios from "@/lib/axios"



export default async function addInstru(Data:FormData ){

    try{
         const res = await Axios.post("/add-instru" , Data ,{
            headers: { "Content-Type": "multipart/form-data" }});
        console.log('reponse:', res.data);
        return res.data;
    
}catch (error){

        console.log('erreur:', error);
        return error;
}

}


