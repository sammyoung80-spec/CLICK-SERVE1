import { City, CityData, Order, Supplier, NigerianBank } from '../types';

export const TRANSPORT_RATE_PER_KM = 70; // NGN
export const PLATFORM_FEE_PERCENT = 0.02; // 2%
export const CREDIT_SURCHARGE_PERCENT = 0.02; // 2% extra for credit
export const INSTANT_PAYOUT_FEE_PERCENT = 0.02; // 2% for instant payout
export const DISCOUNTING_FEE_PERCENT = 0.035; // 3.5% for early liquidity

export const CITY_METRICS: Record<City, CityData> = {
    'Abuja': { name: 'Abuja', price: 1150, supply: 'Medium', activeSuppliers: 12 },
    'Lagos': { name: 'Lagos', price: 1080, supply: 'High', activeSuppliers: 35 },
    'Kano': { name: 'Kano', price: 1250, supply: 'Low', activeSuppliers: 8 },
    'Port Harcourt': { name: 'Port Harcourt', price: 1120, supply: 'Medium', activeSuppliers: 15 },
};

export const CREDIT_LIMITS = {
    'SME': 2000000,
    'Corporate': 15000000,
    'Industrial': 100000000
};

export const TESTIMONIALS = [
    { name: 'Alhaji Musa', company: 'Northern Logistics Ltd', text: "Since using Click & Serve, our fleet downtime formatted due to fuel scarcity has dropped 90%." },
    { name: 'Chinedu Okeke', company: 'Prime Manufacturing', text: "The credit facility is a lifesaver. We get fuel today and pay in 14 days. Brilliant." },
    { name: 'Sarah Johnson', company: 'Lagos Islanders Power', text: "We buy 33,000 liters weekly. The density verification ensures we never buy adulterated product." }
];

export const MOCK_SUPPLIERS: Supplier[] = [
    { id: 'SUP-LAG-001', name: 'Oando Terminal A', city: 'Lagos', pricePerLiter: 1080, density: 0.850, etaMinutes: 45, rating: 4.8, availableLiters: 45000, isVerified: true, verificationStatus: 'Verified' },
    { id: 'SUP-LAG-002', name: 'TotalEnergies Depot', city: 'Lagos', pricePerLiter: 1095, density: 0.845, etaMinutes: 30, rating: 4.9, availableLiters: 120000, isVerified: true, verificationStatus: 'Verified' },
    { id: 'SUP-ABJ-001', name: 'AA Rano', city: 'Abuja', pricePerLiter: 1150, density: 0.840, etaMinutes: 60, rating: 4.5, availableLiters: 30000, isVerified: true, verificationStatus: 'Verified' },
    { id: 'SUP-ABJ-002', name: 'Independent Marketer X', city: 'Abuja', pricePerLiter: 1140, density: 0.835, etaMinutes: 90, rating: 3.8, availableLiters: 10000, isVerified: false, verificationStatus: 'Pending' },
    { id: 'SUP-PH-001', name: 'Conoil Rivers', city: 'Port Harcourt', pricePerLiter: 1120, density: 0.848, etaMinutes: 40, rating: 4.7, availableLiters: 60000, isVerified: true, verificationStatus: 'Verified' },
    { id: 'SUP-KAN-001', name: 'Kano Pillars Energy', city: 'Kano', pricePerLiter: 1250, density: 0.830, etaMinutes: 120, rating: 4.2, availableLiters: 25000, isVerified: true, verificationStatus: 'Verified' },
];

export const MOCK_ORDERS: Order[] = [
    { id: 'ORD-7721', buyerName: 'Julius Berger', liters: 10000, distanceKm: 15, totalCost: 11500000, status: 'In Transit', paymentMethod: 'Credit', timestamp: '2023-11-20T10:30:00', priority: 'High', truckLocation: { lat: 6.5244, lng: 3.3792 } },
    { id: 'ORD-7722', buyerName: 'Dangote Cement', liters: 33000, distanceKm: 45, totalCost: 35000000, status: 'Delivered', paymentMethod: 'Pay Now', timestamp: '2023-11-19T14:15:00', priority: 'Normal' },
    { id: 'ORD-7723', buyerName: 'Nestle Nigeria', liters: 5000, distanceKm: 8, totalCost: 5500000, status: 'Pending', paymentMethod: 'Pay Now', timestamp: '2023-11-20T11:45:00', priority: 'Low' },
    { id: 'ORD-7724', buyerName: 'Eko Hotels', liters: 15000, distanceKm: 5, totalCost: 16200000, status: 'Paid', paymentMethod: 'Pay Now', timestamp: '2023-11-18T09:00:00', priority: 'High', isDiscounted: true },
];

export const MOCK_BUYERS = [
    { id: 'BUY-001', name: 'Julius Berger PLC', city: 'Abuja', volume: 'High', creditScore: 850 },
    { id: 'BUY-002', name: 'Eko Hotels & Suites', city: 'Lagos', volume: 'Medium', creditScore: 780 },
    { id: 'BUY-003', name: 'Kano Textiles', city: 'Kano', volume: 'Medium', creditScore: 650 },
];

export const NIGERIAN_BANKS: NigerianBank[] = [
    { name: 'Zenith Bank', code: '057', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Zenith_Bank_Logo.svg/2560px-Zenith_Bank_Logo.svg.png' },
    { name: 'GTBank', code: '058', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/GTBank_logo.svg/1200px-GTBank_logo.svg.png' },
    { name: 'Access Bank', code: '044', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Access_Bank_Logo.png/1200px-Access_Bank_Logo.png' },
    { name: 'First Bank', code: '011', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/First_Bank_of_Nigeria_logo.svg/1200px-First_Bank_of_Nigeria_logo.svg.png' },
    { name: 'UBA', code: '033', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/United_Bank_for_Africa_logo.svg/1200px-United_Bank_for_Africa_logo.svg.png' }
];
