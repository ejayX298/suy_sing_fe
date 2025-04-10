import axios from 'axios';

export default function httpClient(api_key : string) {
  
  const basehttpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      // 'X-API-KEY':`${api_key}`,
    },
  });

  return basehttpClient;

} 
