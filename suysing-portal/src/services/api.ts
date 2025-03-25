
// Mock authentication service
export const authService = {
  login: async (username: string, password: string) => {
    if (username && password) {
      // Mock successful login response
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: 1,
          name: 'John Doe',
          username,
          role: 'admin'
        }
      };
    }
    // Mock failed login
    return {
      success: false,
      message: 'Invalid username or password'
    };
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
  getCustomers: async () => {
    return customerActivitiesData.customers;
  },
  getSummary: async () => {
    return customerActivitiesData.summary;
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
  getBooths: async () => {
    return boothActivitiesData.booths;
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
    { id: 8, code: 'ANDR008', name: 'Andrew Philip', type: 'Green', totalVisited: 12 }
  ],
  getCustomers: async () => {
    return boothHoppingReportData.customers;
  },
  getCustomerById: async (id: number) => {
    return boothHoppingReportData.customers.find(c => c.id === id);
  }
};

export const bestBoothReportData = {
  getCustomers: async () => {
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
  getCustomerById: async (id: number) => {
    const customers = await bestBoothReportData.getCustomers();
    return customers.find(customer => customer.id === id) || null;
  }
};

