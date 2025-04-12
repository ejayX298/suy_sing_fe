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

          const stored_hash_code = localStorage.getItem('hash_code');
          
          // Reload page on initial saving data for refreshing of bottom navigation urls
          if(!stored_hash_code){
            localStorage.setItem('customer_info', JSON.stringify(mapResponse));
            localStorage.setItem('hash_code', hash_code);
            window.location.href = `/my-qr/?cc=${hash_code}`
          }

          localStorage.setItem('customer_info', JSON.stringify(mapResponse));
          localStorage.setItem('hash_code', hash_code);
        }
      }
      

      return {
        success : true,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        success : false,
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



export const bestBooth = {
 
  getBoothList: async () => {

    try{

      let hash_code:any = ''
      let customer_info:any = {}
      
      if (typeof window !== 'undefined') {
         hash_code = localStorage.getItem('hash_code');
         customer_info = localStorage.getItem('customer_info');
      }
    
      const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
      const session_id = customerInfoParsed?.session_id || ''
  
      const response = await httpClient(session_id).get(`/customer/voting/booth/list/`, {});
      
      const response_data = response?.data?.data || []
      
      const mapBlueBooths = response_data.blue_booths.map(booth => ({
        boothCode: booth.code,
        image: '/images/booths/' + booth.code + '.png',
        ...booth
      }));

      const mapOrangeBooths = response_data.orange_booths.map(booth => ({
        boothCode: booth.code,
        image: '/images/booths/' + booth.code + '.png',
        ...booth
      }));

      const mapRedBooths = response_data.red_booths.map(booth => ({
        boothCode: booth.code,
        image: '/images/booths/' + booth.code + '.png',
        ...booth
      }));

      const mapResponse = {
        blue_booths: mapBlueBooths || [],
        orange_booths: mapOrangeBooths || [],
        red_booths: mapRedBooths || [],
      }
      
      return {
        success : true,
        results : mapResponse
      }
    

    } catch (error) {
      
      const default_err_response = {
        success : false,
        results : {
          blue_booths : [],
          orange_booths: [],
          red_booths: []
        }
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

  },

  submitBoothVoting: async (post_data : any) => {

    try{
      
      const hash_code = localStorage.getItem('hash_code');

      const customer_info = localStorage.getItem('customer_info');
      const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
      const session_id = customerInfoParsed?.session_id || ''
      const customer_id = customerInfoParsed?.id || ''
  
      const response = await httpClient(session_id).post(`/customer/voting/booth/submit/`, {
        customer_id : customer_id,
        booth_ids: JSON.stringify(post_data)
      });
      
      const response_data = response?.data?.data || []
      
      return {
        success : true,
        results : []
      }
    

    } catch (error) {
    
      if (axios.isAxiosError(error)) {
        
        const errResp = error.response;
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
        
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }

  },
 
}



export const auditorService = {
 
  checkAccess: async (code : any) => {

    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';

    try{
      const hash_code = code;
  
      const response = await httpClient(api_key).get(`/auditor/check_auditor/?ahc=${hash_code}&is_auditor=1`, {});
      
      const response_data = response?.data?.data || []

      
      if (typeof window !== 'undefined') {
        localStorage.setItem('audit_hash_code', hash_code);
      }
      

      return {
        success : true
      }
    

    } catch (error) {

      const default_err_response = {
        success : false,
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }
  },



  checkCustomerRecord: async (code : any, customer_code : string) => {

    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';

    try{
      const hash_code = code;
  
      const response = await httpClient(api_key).get(`/customer/get_details/?ahc=${hash_code}&customer_code=${customer_code}&is_auditor=1`, {});
      
      const response_data = response?.data?.data || []
      
      if(response_data){
        if (typeof window !== 'undefined') {
          localStorage.setItem('audit_info', JSON.stringify(response_data));
        }
      }

      return {
        success : true,
        message : "success",
        results : response_data
      }
    

    } catch (error) {

      const errResp = error.response;
      
      if (axios.isAxiosError(error)) {
        
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }
  },


  checkCustomerRecordbyId: async (code : any, customer_id : number) => {

    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';

    try{
      const hash_code = code;
  
      const response = await httpClient(api_key).get(`/customer/get_details/?ahc=${hash_code}&customer_id=${customer_id}&is_auditor=1`, {});
      
      const response_data = response?.data?.data || []

      if(response_data){
        if (typeof window !== 'undefined') {
          localStorage.setItem('audit_info', JSON.stringify(response_data));
        }
      }

      return {
        success : true,
        message : "success",
        results : response_data
      }
    

    } catch (error) {

      const errResp = error.response;
      
      if (axios.isAxiosError(error)) {
        
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }
  },


  getUnvisitedBoothlist: async (customer_id : number) => {

    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';

    try{
  
      const response = await httpClient(api_key).get(`/customer/booth/unvisited/?customer_id=${customer_id}&is_auditor=1`, {});
      
      const response_data = response?.data?.data || []

      return {
        success : true,
        message : "success",
        results : response_data
      }
    

    } catch (error) {

      const default_err_response = {
        success : false,
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }
  },


  overrideBoothVisit: async (customer_id : number) => {

    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';

    try{
  
      const response = await httpClient(api_key).get(`/customer/booth/override/?customer_id=${customer_id}&is_auditor=1`, {});
      
      const response_data = response?.data?.data || []

      return {
        success : true,
        results : response_data
      }
    

    } catch (error) {

      const errResp = error.response;
      
      if (axios.isAxiosError(error)) {
        
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }
  },


  getBoothList: async () => {

    try{

      const api_key = process.env.NEXT_PUBLIC_API_KEY || '';
  
      const response = await httpClient(api_key).get(`/customer/voting/booth/list/?is_auditor=1`, {});
      
      const response_data = response?.data?.data || []
      
      const mapBlueBooths = response_data.blue_booths.map(booth => ({
        boothCode: booth.code,
        image: '/images/booths/' + booth.code + '.png',
        ...booth
      }));

      const mapOrangeBooths = response_data.orange_booths.map(booth => ({
        boothCode: booth.code,
        image: '/images/booths/' + booth.code + '.png',
        ...booth
      }));

      const mapRedBooths = response_data.red_booths.map(booth => ({
        boothCode: booth.code,
        image: '/images/booths/' + booth.code + '.png',
        ...booth
      }));

      const mapResponse = {
        blue_booths: mapBlueBooths || [],
        orange_booths: mapOrangeBooths || [],
        red_booths: mapRedBooths || [],
      }
      
      return {
        success : true,
        results : mapResponse
      }
    

    } catch (error) {
      
      const default_err_response = {
        success : false,
        results : {
          blue_booths : [],
          orange_booths: [],
          red_booths: []
        }
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

  },

  submitBoothVoting: async (post_data : any) => {

    try{
      
      const api_key = process.env.NEXT_PUBLIC_API_KEY || '';
      let audit_info:any = {}
      
      if (typeof window !== 'undefined') {
        audit_info = localStorage.getItem('audit_info');
      }
    
      const auditInforParsed = audit_info ? JSON.parse(audit_info) : [];
      const customer_id = auditInforParsed?.id || ''
  
      const response = await httpClient(api_key).post(`/customer/voting/booth/submit/?is_auditor=1`, {
        customer_id : customer_id,
        booth_ids: JSON.stringify(post_data)
      });
      
      const response_data = response?.data?.data || []
      
      return {
        success : true,
        results : []
      }
    

    } catch (error) {
    
      if (axios.isAxiosError(error)) {
        
        const errResp = error.response;
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
        
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }

  },

  getSouvenirList: async () => {

    try{

      const api_key = process.env.NEXT_PUBLIC_API_KEY || '';
  
      const response = await httpClient(api_key).get(`/customer/souvenir/list/?is_auditor=1`, {});
      
      const response_data = response?.data?.data || []
     
      const mapResponse = response_data.souvenirs.map(souvenir => ({
        id : souvenir.id,
        name: souvenir.name,
        image: '/images/souvenir/' + souvenir.code + '.png'
      }));
      
      return {
        success : true,
        results : mapResponse
      }
    

    } catch (error) {
      
      const default_err_response = {
        success : false,
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

  },


  submitSouvenir: async (post_data : any) => {

    try{
      
      const api_key = process.env.NEXT_PUBLIC_API_KEY || '';
      let audit_info:any = {}
      
      if (typeof window !== 'undefined') {
        audit_info = localStorage.getItem('audit_info');
      }

      const auditInforParsed = audit_info ? JSON.parse(audit_info) : [];
      const customer_id = auditInforParsed?.id || ''
  
      const response = await httpClient(api_key).post(`/customer/souvenir/submit/?is_auditor=1`, {
        customer_id : customer_id,
        souvenir_id: post_data.souvenir_id
      });
      
      const response_data = response?.data?.data || []
      
      return {
        success : true,
        results : []
      }
    

    } catch (error) {
    
      if (axios.isAxiosError(error)) {
        
        const errResp = error.response;
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
        
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }

  },
  

}


export const boothVisitService = {


  getCustomerRecord: async () => {

    const customer_info = localStorage.getItem('customer_info');
    const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
    const api_key = process.env.NEXT_PUBLIC_API_KEY || '';
    const customer_id = customerInfoParsed?.id || ''
    try{
      const response = await httpClient(api_key).get(`/customer/get_details/?customer_id=${customer_id}`, {});
      
      const response_data = response?.data?.data || []

      return {
        success : true,
        message : "success",
        results : response_data
      }
    

    } catch (error) {

      const errResp = error.response;
      
      if (axios.isAxiosError(error)) {
        
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }
  },


  getUnvisitedBoothlist: async () => {

    const customer_info = localStorage.getItem('customer_info');
    const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
    const customer_id = customerInfoParsed?.id || ''
    const session_id = customerInfoParsed?.session_id || ''

    try{
  
      const response = await httpClient(session_id).get(`/customer/booth/unvisited/?customer_id=${customer_id}`, {});
      
      const response_data = response?.data?.data || []

      return {
        success : true,
        message : "success",
        results : response_data
      }
    

    } catch (error) {

      const default_err_response = {
        success : false,
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }
  },


  getVisitedBoothlist: async () => {

    const customer_info = localStorage.getItem('customer_info');
    const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
    const customer_id = customerInfoParsed?.id || ''
    const session_id = customerInfoParsed?.session_id || ''
    
  
    try{
  
      const response = await httpClient(session_id).get(`/customer/booth/visited/?customer_id=${customer_id}&order_by=asc`, {});
      
      const response_data = response?.data?.data || []
  
      return {
        success : true,
        message : "success",
        results : response_data
      }
    
  
    } catch (error) {
  
      const default_err_response = {
        success : false,
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }
  },
  

  submitBoothVisit: async (post_data : any) => {

    try{
      
      const customer_info = localStorage.getItem('customer_info');
      const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
      const session_id = customerInfoParsed?.session_id || ''
      const customer_id = customerInfoParsed?.id || ''
  
      const response = await httpClient(session_id).post(`/customer/booth/submit/`, {
        customer_id : customer_id,
        booth_codes: JSON.stringify(post_data)
      });
      
      const response_data = response?.data?.data || []
      
      return {
        success : true,
        results : response_data
      }
    

    } catch (error) {
    
      if (axios.isAxiosError(error)) {
        
        const errResp = error.response;
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
        
      }else{
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }

  },

}


export const dealCartService = {
 
  getCustomerParams: async () => {

    const customer_info = localStorage.getItem('customer_info');
    const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
    const customer_id = customerInfoParsed?.id || ''
    const session_id = customerInfoParsed?.session_id || ''

    try{
  
      const response = await httpClient(session_id).get(`/customer/deal/cart/params/?customer_id=${customer_id}`, {});
      
      const response_data = response?.data?.data || []
      

      return {
        success : true,
        results : response_data
      }
    

    } catch (error) {

      const default_err_response = {
        success : false,
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

  },


  getBoothProducts: async () => {

    const customer_info = localStorage.getItem('customer_info');
    const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
    const customer_id = customerInfoParsed?.id || ''
    const session_id = customerInfoParsed?.session_id || ''

    try{
  
      const response = await httpClient(session_id).get(`/customer/booth/products/?customer_id=${customer_id}`, {});
      
      const response_data = response?.data?.data || []

      const mapBoothProducts = response_data.booths.map(booth => ({
        id: booth.id,
        name: booth.name,
        code: booth.code,
        description: booth.description,
        products : booth.products.map(boothProduct => ({
          id: boothProduct.id,
          itemCode: boothProduct.item_code,
          name: boothProduct.name,
          quantity: 0,
          discount: (boothProduct.discount * 100) + "% Discount",
        }))
      }));
      

      return {
        success : true,
        results : mapBoothProducts
      }
    

    } catch (error) {

      const default_err_response = {
        success : false,
        results : []
      }
      if (axios.isAxiosError(error)) {
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

  },


  createDealCart: async (post_data : any) => {

    try{
  
      const customer_info = localStorage.getItem('customer_info');
      const customerInfoParsed = customer_info ? JSON.parse(customer_info) : [];
      const session_id = customerInfoParsed?.session_id || ''
      const customer_id = customerInfoParsed?.id || ''

      const mapBoothProducts = post_data?.selectedProducts?.map((boothProduct: { id: string; quantity: string; }) => ({
        booth_product_id: boothProduct.id,
        order_qty: boothProduct.quantity
      })) || [];
    
      const response = await httpClient(session_id).post(`/customer/deal/cart/create/`, {
        customer_id : customer_id,
        customer_code : post_data?.customerCode || "",
        transaction_type : post_data?.transactionType || "",
        remarks : post_data?.remarks || "",
        address : post_data?.shipToAddress || "",
        branch : post_data?.branch || "",
        products : JSON.stringify(mapBoothProducts)
      });
      
      const response_data = response?.data?.data || []
      
      return {
        success : true,
        results : response_data
      }
    

    } catch (error) {
    
      if (axios.isAxiosError(error)) {
        
        const errResp = error.response;
        return {
          success: false,
          message: errResp?.data?.message || 'Error! Please try again later'
        };
        
      }else{
        console.log(error)
        return {
          success: false,
          message: 'Unable to process your request. Please try again later.'
        };
      }
     
    }

  },
 
}


 