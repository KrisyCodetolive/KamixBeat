import axios from 'axios';

// Liste de tes IPs locales (si tu bosses sur plusieurs réseaux Wi-Fi)
const IPs: string[] = [
  "http://192.168.1.11:3000",
  "http://172.20.10.2:3000"
];


const baseURL = process.env.NEXT_PUBLIC_API_URL || IPs[0];

const api = axios.create({
  baseURL,

});

export default api;
