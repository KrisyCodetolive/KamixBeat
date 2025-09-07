import axios from "axios";
//import getLocalIP from "@/utils/GetIpv4";

//const IP = getLocalIP();
const Axios = axios.create({

    baseURL:`http://192.168.1.9:3003/instrumental`
})

export default Axios