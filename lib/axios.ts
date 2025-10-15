import axios from "axios";
//import getLocalIP from "@/utils/GetIpv4";

//const IP = getLocalIP();
//const ip = "192.168.1.11";
const ip = "172.20.10.2";
const Axios = axios.create({

    baseURL:`http://${ip}:3000`
})

export default Axios