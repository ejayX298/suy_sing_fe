import httpClient,  from './base/httpClient';
import axios from 'axios';


export const customerQr = {
 
  getCustomer: async (code : any) => {

    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';

    try{
      const hash_code = code;
  
      const response = await httpClient(api_key).get(`/customer/details/?chc=${hash_code}`, {});
      
      const response_data = response?.data?.data || []
      
      const mapResponse = {
        id: response_data?.id,
        code: response_data?.code,
        customer_type: response_data?.customer_type,
        full_name: `${response_data?.fname} ${response_data?.mname}  ${response_data?.lname} `,
        session_id: response_data?.session_id
      }

      if(response_data){
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('customer_info', JSON.stringify(mapResponse));
        }
      }
      

      return {
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

  },
 
}


