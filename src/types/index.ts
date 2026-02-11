export type City = 'Abuja' | 'Lagos' | 'Kano' | 'Port Harcourt';

export type UserRole = 'buyer' | 'supplier' | 'admin_manager' | 'admin_auditor' | 'admin_ceo';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'In Review';

export type AppView = 'landing' | 'login' | 'signup' | 'buyer' | 'supplier' | 'admin' | 'profile' | 'about' | 'contact' | 'marketplace';

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  businessName?: string;
  city?: City;
}

export interface CityData {
  name: City;
  price: number; // NGN per liter
  supply: 'High' | 'Medium' | 'Low';
  activeSuppliers: number;
}

export interface Supplier {
  id: string;
  name: string;
  city: City;
  pricePerLiter: number;
  density: number; // e.g. 0.845
  etaMinutes: number;
  rating: number; // 0-5
  availableLiters: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  docs?: {
    cac: 'missing' | 'pending' | 'verified';
    tin: 'missing' | 'pending' | 'verified';
  };
}

export interface Order {
  id: string;
  buyerName: string;
  liters: number;
  distanceKm: number;
  totalCost: number;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Paid';
  paymentMethod: 'Pay Now' | 'Credit';
  timestamp: string;
  priority: 'High' | 'Normal' | 'Low';
  truckLocation?: LatLng;
  isDiscounted?: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  joinedDate: string;
  documents: {
    name: string;
    status: 'Verified' | 'Pending';
  }[];
}

export interface NigerianBank {
  name: string;
  code: string;
  logo: string;
}
