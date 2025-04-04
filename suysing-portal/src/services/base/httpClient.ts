import axios from 'axios';

export default function httpClient(token : string) {

  const basehttpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      'Authorization':`Bearer ${token}`,
    },
  });

  return basehttpClient;

} 
