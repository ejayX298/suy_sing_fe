import httpClient,  from './base/httpClient';
import axios from 'axios';
import { validateTokenResponse } from '@/lib/utils';
import { getComponentTypeModule } from 'next/dist/server/lib/app-dir-module';

// Mock authentication service
export const authService = {
  login: async (username: string, password: string) => {
    if (username && password) {
      // Mock successful login response
      // return {
      //   success: true,
      //   token: 'mock-jwt-token',
      //   user: {
      //     id: 1,
      //     name: 'John Doe',
      //     username,
      //     role: 'admin'
      //   }
      // };

      try{
        const response = await httpClient().post('/admin/login/', {
          email: username,
          password: password
        });

        return {
          success: true,
          message: response?.data?.message,
          data : response?.data?.data || []
        };

      } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
          const errResp = error.response;
          return {
            success: false,
            message: errResp?.data?.message || 'Error! Please try again later'
          };

        } else {
           // Mock failed login
          return {
            success: false,
            message: 'Unable to process your request. Please try again later.'
          };
        }
      }
     
      
    }
   
  },
  logout: async () => {
    // Clear any stored authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth');
    }
    return { success: true };
  }
};


export const customerActivitiesData = {
  summary: {
    boothHopping: 100,
    boothVoting: 40,
    souvenirClaiming: 30
  },
  customers: [
    {
      id: 1,
      code: 'STAC001',
      name: 'Stacey Cruz',
      totalBoothVisited: '10/80',
      boothHopping: 'Pending',
      boothVoting: 'Pending',
      souvenirClaiming: 'Pending',
      type: 'Red'
    },
    {
      id: 2,
      code: 'ALDR002',
      name: 'Aldrin Tan',
      totalBoothVisited: '72/80',
      boothHopping: 'Pending',
      boothVoting: 'Pending',
      souvenirClaiming: 'Pending',
      type: 'Red'
    },
    {
      id: 3,
      code: 'BRUN003',
      name: 'Bruno Perez',
      totalBoothVisited: '65/80',
      boothHopping: 'Pending',
      boothVoting: 'Pending',
      souvenirClaiming: 'Pending',
      type: 'Red'
    },
    {
      id: 4,
      code: 'OMAR004',
      name: 'Omar Santiago',
      totalBoothVisited: '55/80',
      boothHopping: 'Pending',
      boothVoting: 'Pending',
      souvenirClaiming: 'Pending',
      type: 'Red'
    },
    {
      id: 5,
      code: 'JOHN005',
      name: 'John Dela Cruz',
      totalBoothVisited: '25/80',
      boothHopping: 'Pending',
      boothVoting: 'Pending',
      souvenirClaiming: 'Pending',
      type: 'Red'
    },
    {
      id: 6,
      code: 'MATT006',
      name: 'Matthew Paz',
      totalBoothVisited: '80/80',
      boothHopping: 'Completed',
      boothVoting: 'Completed',
      souvenirClaiming: 'Completed',
      type: 'Green'
    },
    {
      id: 7,
      code: 'ROBE007',
      name: 'Robert Sebastian',
      totalBoothVisited: '80/80',
      boothHopping: 'Completed',
      boothVoting: 'Completed',
      souvenirClaiming: 'Completed',
      type: 'Green'
    },
    {
      id: 8,
      code: 'ANDR008',
      name: 'Andrew Philip',
      totalBoothVisited: '80/80',
      boothHopping: 'Completed',
      boothVoting: 'Completed',
      souvenirClaiming: 'Completed',
      type: 'Green'
    }
  ],
  getCustomers: async (token : string, filterParams : any) => {

    try{
      const {page, perpage, query} = filterParams
  
      const response = await httpClient(token).get(`/admin/customer-activities/list/?page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.customers.map(customer => ({
        id : customer.id,
        code : customer.code,
        name : customer.full_name,
        totalBoothVisited : customer.total_booth_visited,
        boothHopping : customer.is_booth_hopping,
        boothVoting : customer.is_booth_voting,
        souvenirClaiming : customer.is_souvenir_claim,
        type : customer.customer_type,
      }));
      
      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }
     
    }

    // Mock response
    // return customerActivitiesData.customers;
  },
  getSummary: async (token : string) => {
    
    try{
      const response = await httpClient(token).get('/admin/customer-activities/dashboard-count/', {});

      const response_data = response?.data?.data || []
      
      return {
        boothHopping: response_data?.booth_hopping || 0,
        boothVoting: response_data?.booth_voting || 0,
        souvenirClaiming : response_data?.souvenir_claim || 0,
      };

    } catch (error) {
      
      const default_err_response = {
        boothHopping: 0,
        boothVoting: 0,
        souvenirClaiming : 0,
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }
     

    }
    // Mock response
    // return customerActivitiesData.summary;
  }
};


export const boothActivitiesData = {
  booths: [
    { id: 1, name: 'Alaska Corporation', status: 'Open' },
    { id: 2, name: 'RC Cola', status: 'Open' },
    { id: 3, name: 'Kid Tan', status: 'Open' },
    { id: 4, name: 'Original', status: 'Open' },
    { id: 5, name: 'San Miguel Corporation', status: 'Open' },
    { id: 6, name: 'SRIM', status: 'Open' },
    { id: 7, name: 'Argentina', status: 'Closed Early' },
    { id: 8, name: 'PurefoNds', status: 'Closed Early' }
  ],
  getBooths: async (token : string, filterParams : any) => {
    
    try{
      
      const {page, perpage, query} = filterParams
  
      const response = await httpClient(token).get(`/admin/booth-activities/list/?page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.booths.map(booth => ({
        id : booth.id,
        name : booth.name,
        status : booth.pretty_status,
      }));
      
    
      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {
      
      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }

    }

    // Mock response
    // return boothActivitiesData.booths;
  }
};

export const boothHoppingReportData = {
  customers: [
    { 
      id: 1, 
      code: 'STAC001', 
      name: 'Stacey Cruz', 
      type: 'Red', 
      totalVisited: 75,
      store: 'Stacey Grocery Store',
      boothVisits: [
        { boothName: 'Unilever', boothCode: 'UNIL101', date: 'May 4, 2025', time: '1:03 PM', count: 1 },
        { boothName: 'Century Tuna', boothCode: 'CENT102', date: 'May 4, 2025', time: '1:05 PM', count: 1 },
        { boothName: 'Pepsi', boothCode: 'PEPS103', date: 'May 4, 2025', time: '1:08 PM', count: 1 },
        { boothName: 'Asian Brewery', boothCode: 'ASBR104', date: 'May 4, 2025', time: '1:10 PM', count: 1 },
        { boothName: 'Jolly Claro', boothCode: 'JOCL105', date: 'May 4, 2025', time: '1:15 PM', count: 1 },
        { boothName: 'Del Monte', boothCode: 'DEMO106', date: 'May 4, 2025', time: '1:23 PM', count: 1 },
        { boothName: 'Colgate', boothCode: 'COLG201', date: 'May 4, 2025', time: '1:55 PM', count: 2 },
        { boothName: 'Universal Robina', boothCode: 'UNIR202', date: 'May 4, 2025', time: '3:09 PM', count: 2 },
        { boothName: 'NutriAsia', boothCode: 'NUAS203', date: 'May 4, 2025', time: '3:26 PM', count: 2 },
        { boothName: 'Oishi', boothCode: 'OSHI204', date: 'May 4, 2025', time: '3:45 PM', count: 2 }
      ]
    },
    { id: 2, code: 'ALDR002', name: 'Aldrin Tan', type: 'Red', totalVisited: 65 },
    { id: 3, code: 'BRUN003', name: 'Bruno Perez', type: 'Red', totalVisited: 45 },
    { id: 4, code: 'OMAR004', name: 'Omar Santiago', type: 'Red', totalVisited: 25 },
    { id: 5, code: 'JOHN005', name: 'John Dela Cruz', type: 'Red', totalVisited: 77 },
    { id: 6, code: 'MATT006', name: 'Matthew Paz', type: 'Green', totalVisited: 33 },
    { id: 7, code: 'ROBE007', name: 'Robert Sebastian', type: 'Green', totalVisited: 45 },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 }, 
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 },

  ],
  getCustomers: async (token : string, filterParams : any) => {

    try{

      const {page, perpage, query} = filterParams
  
      const response = await httpClient(token).get(`/admin/booth-hopping-report/list/?page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.customers.map(customer => ({
        id : customer.id,
        code : customer.code,
        name : customer.full_name,
        type : customer.pretty_customer_type,
        totalVisited : customer.total_booth_visited,
      }));
      
    
      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }

    }

    // Mock response
    // return boothHoppingReportData.customers;
  },
  getCustomerById: async (id: number, token : string, filterParams : any) => {

    try{
      const {page, perpage, query} = filterParams
      
      const response = await httpClient(token).get(`/admin/booth-hopping-report/details/?customer_id=${id}&page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.booth_hopping_history?.total_pages || 0
      const current_page = response_data?.booth_hopping_history?.current_page || 1

      const mapBoothHistory = response_data.booth_hopping_history.booths.map(booth => ({
        boothName : booth.booth_name,
        boothCode : booth.booth_code,
        date : booth.date_of_visit,
        time : booth.time_of_visit,
        count : booth.booth_count,
      }));

      const mapResponse = {
        id : response_data.customer.id,
        code : response_data.customer.code,
        name: response_data.customer.full_name,
        type: response_data.customer.customer_type,
        totalVisited: response_data.customer.total_booth_visited,
        store: response_data.customer.store_name,
        boothVisits : mapBoothHistory
      };
      
    
      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {
      
      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        return default_err_response
      }else{
        return default_err_response
      }

    }

    // Mock response
    // return boothHoppingReportData.customers.find(c => c.id === id);
  }
};

export const bestBoothReportData = {
  getCustomers : async (token : string, filterParams : any) => {

    try{

      const {page, perpage, query} = filterParams
  
      const response = await httpClient(token).get(`/admin/best-booth/report/?page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.customers.map(customer => ({
        id : customer.id,
        code : customer.code,
        name : customer.full_name,
        type : customer.pretty_customer_type,
        timeSubmitted : customer.time_submitted
      }));
      
      
      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }

    }


    //Mock response
    // const customers = await bestBoothReportData.getCustomersMock();
    // return customers;
  },
  getCustomersMock: async () => {
    return [
      {
        id: 1,
        code: 'CUST001',
        name: 'John Doe',
        type: 'Red',
        store: 'ABC Store',
        timeSubmitted: '2023-10-15 10:30 AM',
        totalVisited: 5,
        voteHistory: [
          { color: 'Blue Booth', name: 'Blue Product Display' },
          { color: 'Red Booth', name: 'Red Innovation Zone' }
        ]
      },
      {
        id: 2,
        code: 'CUST002',
        name: 'Jane Smith',
        type: 'Green',
        store: 'XYZ Shop',
        timeSubmitted: '2023-10-15 11:45 AM',
        totalVisited: 3,
        voteHistory: [
          { color: 'Orange Booth', name: 'Orange Interactive Demo' }
        ]
      },
      {
        id: 3,
        code: 'CUST003',
        name: 'Robert Johnson',
        type: 'Red',
        store: 'Main Center',
        timeSubmitted: '2023-10-15 09:15 AM',
        totalVisited: 7,
        voteHistory: [
          { color: 'Blue Booth', name: 'Blue Product Display' }
        ]
      },
      {
        id: 4,
        code: 'CUST004',
        name: 'Sarah Williams',
        type: 'Green',
        store: 'City Market',
        timeSubmitted: '2023-10-15 01:30 PM',
        totalVisited: 4,
        voteHistory: [
          { color: 'Red Booth', name: 'Red Innovation Zone' }
        ]
      },
      {
        id: 5,
        code: 'CUST005',
        name: 'Michael Brown',
        type: 'Red',
        store: 'Downtown Store',
        timeSubmitted: '2023-10-15 03:00 PM',
        totalVisited: 6,
        voteHistory: [
          { color: 'Orange Booth', name: 'Orange Interactive Demo' }
        ]
      },
      {
        id: 6,
        code: 'CUST006',
        name: 'Emily Jones',
        type: 'Green',
        store: 'Corner Shop',
        timeSubmitted: '2023-10-15 12:00 PM',
        totalVisited: 2,
        voteHistory: [
          { color: 'Red Booth', name: 'Red Innovation Zone' }
        ]
      },
      {
        id: 7,
        code: 'CUST007',
        name: 'David Wilson',
        type: 'Red',
        store: 'Central Market',
        timeSubmitted: '2023-10-15 02:15 PM',
        totalVisited: 5,
        voteHistory: [
          { color: 'Blue Booth', name: 'Blue Product Display' }
        ]
      },
      {
        id: 8,
        code: 'CUST008',
        name: 'Lisa Anderson',
        type: 'Green',
        store: 'East Side Shop',
        timeSubmitted: '2023-10-15 10:00 AM',
        totalVisited: 3,
        voteHistory: [
          { color: 'Orange Booth', name: 'Orange Interactive Demo' },
          { color: 'Blue Booth', name: 'Blue Product Display' }
        ]
      },
      {
        id: 9,
        code: 'CUST009',
        name: 'Mark Thomas',
        type: 'Red',
        store: 'West Center',
        timeSubmitted: '2023-10-15 11:30 AM',
        totalVisited: 4,
        voteHistory: [
          { color: 'Blue Booth', name: 'Blue Product Display' }
        ]
      },
      {
        id: 10,
        code: 'CUST010',
        name: 'Amy Walker',
        type: 'Green',
        store: 'North Plaza',
        timeSubmitted: '2023-10-15 01:00 PM',
        totalVisited: 5,
        voteHistory: [
          { color: 'Red Booth', name: 'Red Innovation Zone' }
        ]
      }
    ];
  },
  getCustomerById: async (id: number, token: string) => {

    try{
      
      const response = await httpClient(token).get(`/admin/best-booth/report/get-by-id/?customer_id=${id}`, {});
      
      const response_data = response?.data?.data || []

      const mapBoothVoteHistory = response_data.customer.booth_vote_history.map(boothVote => ({
        color : boothVote.pretty_booth_color_code,
        name : boothVote.booth_name,
      }));

      const mapResponse = {
        id : response_data.customer.id,
        code : response_data.customer.code,
        name: response_data.customer.full_name,
        type: response_data.customer.pretty_customer_type,
        totalVisited: response_data.customer.total_booth_visited,
        store: response_data.customer.store_name,
        voteHistory : mapBoothVoteHistory
      };
      
    
      return {
        results : mapResponse
      }
    

    } catch (error) {
      
      const default_err_response = {
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        return default_err_response
      }else{
        return default_err_response
      }

    }


    // Mock response
    // const customers = await bestBoothReportData.getCustomersMock();
    // return customers.find(customer => customer.id === id) || null;
  }
};

export const bestBoothWinnerTallyData = {

  getBooths : async (token : string, filterParams : any) => {
    try{

      const {page, perpage, query, color_code} = filterParams
  
      const response = await httpClient(token).get(`/admin/best-booth/winner-tally/?page=${page}&perpage=${perpage}&color_code=${color_code}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.booths.map(booth => ({
        id : booth.id,
        rank : booth.rank_no,
        code : booth.code,
        name : booth.name,
        color : booth.pretty_color_code,
        totalVotes : booth.total_no_of_votes
      }));

      
      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }

    }

    //Mock response
    // const booths = await bestBoothWinnerTallyData.getBoothsMock();
    // return booths;
  }, 
  getBoothsMock: async () => {
    return [
      {
        id: 1,
        rank: 1,
        name: 'Blue Product Display',
        code: 'BOOTH001',
        color: 'Blue Booth',
        totalVotes: 145
      },
      {
        id: 2,
        rank: 2,
        name: 'Red Innovation Zone',
        code: 'BOOTH002',
        color: 'Red Booth',
        totalVotes: 120
      },
      {
        id: 3,
        rank: 3,
        name: 'Orange Interactive Demo',
        code: 'BOOTH003',
        color: 'Orange Booth',
        totalVotes: 98
      },
      {
        id: 4,
        rank: 4,
        name: 'Blue Technology Corner',
        code: 'BOOTH004',
        color: 'Blue Booth',
        totalVotes: 87
      },
      {
        id: 5,
        rank: 5,
        name: 'Red Solutions Hub',
        code: 'BOOTH005',
        color: 'Red Booth',
        totalVotes: 76
      },
      {
        id: 6,
        rank: 6,
        name: 'Orange Experience Zone',
        code: 'BOOTH006',
        color: 'Orange Booth',
        totalVotes: 65
      },
      {
        id: 7,
        rank: 7,
        name: 'Blue Innovations',
        code: 'BOOTH007',
        color: 'Blue Booth',
        totalVotes: 54
      },
      {
        id: 8,
        rank: 8,
        name: 'Red Showcase',
        code: 'BOOTH008',
        color: 'Red Booth',
        totalVotes: 43
      },
      {
        id: 9,
        rank: 9,
        name: 'Orange Demonstrations',
        code: 'BOOTH009',
        color: 'Orange Booth',
        totalVotes: 32
      },
      {
        id: 10,
        rank: 10,
        name: 'Blue Solutions Center',
        code: 'BOOTH010',
        color: 'Blue Booth',
        totalVotes: 21
      }
    ];
  }
};

// Souvenir Claim Data
export const souvenirClaimData = {

  getClaims : async (token : string, filterParams : any) => {
    
    try{

      const {page, perpage, query} = filterParams
  
      const response = await httpClient(token).get(`/admin/souvenir/claim/?page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.customers.map(customer => ({
        id : customer.id,
        code : customer.code,
        name : customer.full_name,
        type : customer.customer_type,
        status : customer.pretty_claim_status,
        item : customer.item_claimed,
        timeClaimed : customer.time_claimed,
      }));

      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }

    }

    //Mock response
    // const claims = await souvenirClaimData.getClaimsMock();
    // return claims;
  },
  
  getClaimsMock: async () => {
    return [
      {
        id: 1,
        code: 'CUST001',
        name: 'John Doe',
        type: 'Red',
        status: 'Claimed',
        item: 'Premium Gift Set',
        timeClaimed: '2023-10-15 11:30 AM'
      },
      {
        id: 2,
        code: 'CUST002',
        name: 'Jane Smith',
        type: 'Green',
        status: 'Claimed',
        item: 'Event T-Shirt',
        timeClaimed: '2023-10-15 12:45 PM'
      },
      {
        id: 3,
        code: 'CUST003',
        name: 'Robert Johnson',
        type: 'Red',
        status: 'Pending',
        item: 'Premium Gift Set',
        timeClaimed: '2023-10-15 10:15 AM'
      },
      {
        id: 4,
        code: 'CUST004',
        name: 'Sarah Williams',
        type: 'Green',
        status: 'On Hold',
        item: 'Event T-Shirt',
        timeClaimed: '2023-10-15 02:30 PM'
      },
      {
        id: 5,
        code: 'CUST005',
        name: 'Michael Brown',
        type: 'Red',
        status: 'Claimed',
        item: 'Premium Gift Set',
        timeClaimed: '2023-10-15 04:00 PM'
      },
      {
        id: 6,
        code: 'CUST006',
        name: 'Emily Jones',
        type: 'Green',
        status: 'Claimed',
        item: 'Event Mug',
        timeClaimed: '2023-10-15 01:00 PM'
      },
      {
        id: 7,
        code: 'CUST007',
        name: 'David Wilson',
        type: 'Red',
        status: 'Pending',
        item: 'Premium Gift Set',
        timeClaimed: '2023-10-15 03:15 PM'
      },
      {
        id: 8,
        code: 'CUST008',
        name: 'Lisa Anderson',
        type: 'Green',
        status: 'Claimed',
        item: 'Event T-Shirt',
        timeClaimed: '2023-10-15 11:00 AM'
      },
      {
        id: 9,
        code: 'CUST009',
        name: 'Mark Thomas',
        type: 'Red',
        status: 'On Hold',
        item: 'Premium Gift Set',
        timeClaimed: '2023-10-15 12:30 PM'
      },
      {
        id: 10,
        code: 'CUST010',
        name: 'Amy Walker',
        type: 'Green',
        status: 'Claimed',
        item: 'Event Mug',
        timeClaimed: '2023-10-15 02:00 PM'
      }
    ];
  }
};

export const souvenirAvailabilityData = {

  getSouvenirs : async (token : string, filterParams : any) => {
    
    try{
      
      const {page, perpage, query} = filterParams
  
      const response = await httpClient(token).get(`/admin/souvenir/list/?page=${page}&perpage=${perpage}&query=${query}`, {});
      
      const response_data = response?.data?.data || []

      const total_pages = response_data?.total_pages || 0
      const current_page = response_data?.current_page || 1
      const mapResponse = response_data.souvenirs.map(souvenir => ({
        id : souvenir.id,
        name: souvenir.name,
        totalQuantity: souvenir.qty,
        claimed: souvenir.claimed,
        remaining: souvenir.remaining
      }));

      return {
        total_pages : total_pages,
        current_page : current_page,
        results : mapResponse
      }
    

    } catch (error) {

      const default_err_response = {
        total_pages : 0,
        current_page : 1,
        results : []
      }
      if (axios.isAxiosError(error)) {

        validateTokenResponse(error)
        
        return default_err_response
      }else{
        return default_err_response
      }

    }

    //Mock response
    // const souvenirs = await souvenirAvailabilityData.getSouvenirsMock();
    // return souvenirs;
  },
  
  getSouvenirsMock: async () => {
    return [
      {
        id: 1,
        name: 'Premium Gift Set',
        totalQuantity: 100,
        claimed: 45,
        remaining: 55
      },
      {
        id: 2,
        name: 'Event T-Shirt',
        totalQuantity: 200,
        claimed: 120,
        remaining: 80
      },
      {
        id: 3,
        name: 'Event Mug',
        totalQuantity: 150,
        claimed: 75,
        remaining: 75
      },
      {
        id: 4,
        name: 'Branded Notebook',
        totalQuantity: 300,
        claimed: 210,
        remaining: 90
      },
      {
        id: 5,
        name: 'USB Flash Drive',
        totalQuantity: 120,
        claimed: 85,
        remaining: 35
      },
      {
        id: 6,
        name: 'Event Cap',
        totalQuantity: 180,
        claimed: 110,
        remaining: 70
      },
      {
        id: 7,
        name: 'Tote Bag',
        totalQuantity: 250,
        claimed: 180,
        remaining: 70
      },
      {
        id: 8,
        name: 'Water Bottle',
        totalQuantity: 220,
        claimed: 140,
        remaining: 80
      }
    ];
  }
};

// Sample data for best booth report
export const bestBoothReportDataOriginal = {
  customers: [
    { 
      id: 1, 
      code: 'STAC001', 
      name: 'Stacey Cruz', 
      type: 'Red', 
      timeSubmitted: 'May 4, 2025 | 1:30 PM',
      totalVisited: 75,
      store: 'Stacey Grocery Store',
      voteHistory: [
        { color: 'Blue Booth', name: 'Century Tuna' },
        { color: 'Orange Booth', name: 'Pepsi' },
        { color: 'Red Booth', name: 'Jolly Claro' }
      ]
    },
    { id: 2, code: 'ALDR002', name: 'Aldrin Tan', type: 'Red', timeSubmitted: 'May 4, 2025 | 1:35 PM' },
    { id: 3, code: 'BRUN003', name: 'Bruno Perez', type: 'Red', timeSubmitted: 'May 4, 2025 | 1:36 PM' },
    { id: 4, code: 'OMAR004', name: 'Omar Santiago', type: 'Red', timeSubmitted: 'May 4, 2025 | 1:52 PM' },
    { id: 5, code: 'JOHN005', name: 'John Dela Cruz', type: 'Red', timeSubmitted: 'May 4, 2025 | 2:30 PM' },
    { id: 6, code: 'MATT006', name: 'Matthew Paz', type: 'Green', timeSubmitted: 'May 4, 2025 | 2:30 PM' },
    { id: 7, code: 'ROBE007', name: 'Robert Sebastian', type: 'Green', timeSubmitted: 'May 4, 2025 | 2:38 PM' },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', timeSubmitted: 'May 4, 2025 | 2:45 PM' }
  ],
  getCustomers: async () => {
    return bestBoothReportDataOriginal.customers;
  },
  getCustomerById: async (id: number) => {
    return bestBoothReportDataOriginal.customers.find(c => c.id === id);
  }
};

export const bestBoothWinnerTallyDataOriginal = {
  booths: [
    { id: 1, rank: 1, name: 'Unilever', code: 'UNIL101', totalVotes: 350 },
    { id: 2, rank: 2, name: 'Century Tuna', code: 'CENT102', totalVotes: 320 },
    { id: 3, rank: 3, name: 'Pepsi', code: 'PEPS103', totalVotes: 318 },
    { id: 4, rank: 4, name: 'Asian Brewery', code: 'ASBR104', totalVotes: 315 },
    { id: 5, rank: 5, name: 'Jolly Claro', code: 'JOCL105', totalVotes: 300 },
    { id: 6, rank: 6, name: 'Del Monte', code: 'DEMO106', totalVotes: 298 },
    { id: 7, rank: 7, name: 'Colgate', code: 'COLG201', totalVotes: 285 },
    { id: 8, rank: 8, name: 'Universal Robina', code: 'UNIR202', totalVotes: 273 },
    { id: 9, rank: 9, name: 'NutriAsia', code: 'NUAS203', totalVotes: 265 },
    { id: 10, rank: 10, name: 'Oishi', code: 'OSHI204', totalVotes: 256 }
  ],
  getBooths: async () => {
    return bestBoothWinnerTallyDataOriginal.booths;
  }
};

export const souvenirClaimDataOriginal = {
  claims: [
    { id: 1, code: 'STAC001', name: 'Stacey Cruz', type: 'Red', status: 'On Hold', item: '-', timeClaimed: '-' },
    { id: 2, code: 'ALDR002', name: 'Aldrin Tan', type: 'Red', status: 'On Hold', item: '-', timeClaimed: '-' },
    { id: 3, code: 'BRUN003', name: 'Bruno Perez', type: 'Red', status: 'Pending', item: '-', timeClaimed: '-' },
    { id: 4, code: 'OMAR004', name: 'Omar Santiago', type: 'Red', status: 'Pending', item: '-', timeClaimed: '-' },
    { id: 5, code: 'JOHN005', name: 'John Dela Cruz', type: 'Red', status: 'Claimed', item: 'Massage Gun', timeClaimed: 'May 4, 2025 | 2:30 PM' },
    { id: 6, code: 'MATT006', name: 'Matthew Paz', type: 'Green', status: 'Claimed', item: 'Massage Gun', timeClaimed: 'May 4, 2025 | 2:30 PM' },
    { id: 7, code: 'ROBE007', name: 'Robert Sebastian', type: 'Green', status: 'Claimed', item: 'Massage Gun', timeClaimed: 'May 4, 2025 | 2:38 PM' },
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', status: 'Claimed', item: 'Massage Gun', timeClaimed: 'May 4, 2025 | 2:45 PM' }
  ],
  getClaims: async () => {
    return souvenirClaimDataOriginal.claims;
  }
};

export const souvenirAvailabilityDataOriginal = {
  souvenirs: [
    { id: 1, name: 'Jacket', totalQuantity: 1500, claimed: 500, remaining: 1000 },
    { id: 2, name: 'Bag', totalQuantity: 1000, claimed: 300, remaining: 700 },
    { id: 3, name: 'Massage Gun', totalQuantity: 1000, claimed: 300, remaining: 700 },
    { id: 4, name: 'Suy Sing 5K Php GC', totalQuantity: 800, claimed: 100, remaining: 700 },
    { id: 5, name: 'Suy Sing 3K Php GC', totalQuantity: 800, claimed: 100, remaining: 700 },
    { id: 6, name: 'Alaska Grocery Package', totalQuantity: 500, claimed: 200, remaining: 300 },
    { id: 7, name: 'Coke Grocery Package', totalQuantity: 500, claimed: 100, remaining: 400 },
    { id: 8, name: 'Cooler', totalQuantity: 1200, claimed: 200, remaining: 1000 }
  ],
  getSouvenirs: async () => {
    return souvenirAvailabilityDataOriginal.souvenirs;
  }
};


