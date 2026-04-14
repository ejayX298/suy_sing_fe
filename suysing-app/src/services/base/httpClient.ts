import axios from 'axios';

interface HttpClientOptions {
  api_key: string;
  is_json?: boolean;
}

export default function httpClient(options: string | HttpClientOptions) {
  // Handle both string (backward compatibility) and object options
  const api_key = typeof options === 'string' ? options : options.api_key;
  const is_json = typeof options === 'object' ? options.is_json ?? false : false;

  const basehttpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': is_json ? 'application/json' : 'multipart/form-data',
      Accept: 'application/json',
      'X-API-KEY': `${api_key}`,
    },
  });

  return basehttpClient;
}
