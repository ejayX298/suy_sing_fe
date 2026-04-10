
// Booth Visit details
export interface BoothVisit {
  boothName: string;
  boothCode: string;
  date: string;
  time: string;
  count: number;
}

// Customer types
export interface BoothVote {
  color: string;
  name: string;
}

export interface Customer {
  id: number;
  code: string;
  name: string;
  type: string;
  store?: string;
  timeSubmitted?: string;
  totalVisited?: number;
  totalBoothVisited?: number | string;
  boothVisits?: BoothVisit[];
  voteHistory?: BoothVote[];
  boothHopping?: boolean | string;
  boothVoting?: boolean | string;
  souvenirClaiming?: boolean | string;
}

// Booth types
export interface Booth {
  id: number;
  name: string;
  code?: string;
  color?: string;
  rank?: number;
  totalVotes?: number;
  visitCount?: number;
  lastVisit?: string;
  status?: string;
}

// Souvenir types
export interface Claim {
  id: number;
  code: string;
  name: string;
  type: string;
  status: string;
  item: string;
  timeClaimed: string;
  released_by: string;
}

export interface Souvenir {
  id: number;
  name: string;
  totalQuantity: number;
  claimed: number;
  remaining: number;
}

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  discount: string;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
}


export interface DealOrderedCustomer {
  id: string;
  customerCode: string;
  customerName: string;
  customerType: string;
  orderedQty: string;
  dateOrdered: string;
}

export interface DealOrderedBoothProducts {
  id: number;
  vendorCode: string;
  vendorName: string;
  itemCode: string;
  itemDescription: string;
  quantity: string;
}

export interface NotificationInt {
  id: number;
  title: string;
  message: string;
  send_to: string;
  color_code: string;
  customer_codes: string;
  scheduled_at?: string;
  scheduled_at_local_time? : string | null;
}