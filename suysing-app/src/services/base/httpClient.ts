import axios from 'axios';

export default function httpClient(api_key : string) {
  console.log('api_key');
  console.log(api_key);
  const basehttpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      'X-API-KEY':`${api_key}`,
    },
  });

  return basehttpClient;

} 
