'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CITY_METRICS, CREDIT_LIMITS } from '@/lib/constants';
import { calculateBuyerTotal, formatCurrency } from '@/utils/pricing';
import { City, Supplier } from '@/types';
import { supabase } from '@/lib/supabase';
import { Truck, AlertTriangle, ShieldCheck, MapPin, Calculator, CreditCard, ChevronRight, Activity, Zap, Building2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hoisted outside component - never recreated
const NIGERIAN_BANKS = [
    { id: 'gtb', name: 'GTB', color: 'bg-orange-500' },
    { id: 'zenith', name: 'Zenith', color: 'bg-red-600' },
    { id: 'first', name: 'First Bank', color: 'bg-blue-800' },
    { id: 'access', name: 'Access', color: 'bg-orange-400' },
    { id: 'uba', name: 'UBA', color: 'bg-red-500' },
    { id: 'opay', name: 'OPay', color: 'bg-green-500' },
];

const CARD_TYPES = [
    { id: 'mastercard', name: 'Mastercard', color: 'bg-orange-500' },
    { id: 'visa', name: 'Visa', color: 'bg-blue-600' },
    { id: 'verve', name: 'Verve', color: 'bg-red-700' },
];

// Custom debounce hook for slider inputs
function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

interface BuyerDashboardProps {
    city: City;
    initialVolume?: number;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ city = 'Lagos', initialVolume = 10000 }) => {
    const [volume, setVolume] = useState(initialVolume);
    const [distance, setDistance] = useState(15);
    const [isCredit, setIsCredit] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [businessType, setBusinessType] = useState<'SME' | 'Corporate' | 'Industrial'>('Corporate');
    const [showPayment, setShowPayment] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'summary' | 'processing' | 'success'>('summary');

    // Payment State
    const [expandedPayment, setExpandedPayment] = useState<'transfer' | 'card' | null>(null);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    // Debounce pricing calculations — only recalculate after user stops dragging for 150ms
    const debouncedVolume = useDebouncedValue(volume, 150);
    const debouncedDistance = useDebouncedValue(distance, 150);

    // Memoize expensive pricing calc
    const currentPricing = useMemo(
        () => calculateBuyerTotal(CITY_METRICS[city].price, debouncedVolume, debouncedDistance, isCredit),
        [city, debouncedVolume, debouncedDistance, isCredit]
    );
    const creditLimit = CREDIT_LIMITS[businessType];
    const isLimitExceeded = isCredit && currentPricing.total > creditLimit;

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('city', city)
                    .eq('is_verified', true);

                if (error) throw error;
                if (data) {
                    setSuppliers(data as Supplier[]);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, [city]);

    const handleOrder = useCallback((supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowPayment(true);
    }, []);

    const processPayment = async () => {
        if (expandedPayment === 'transfer' && !selectedBank) { alert('Please select a receiving bank for the transfer.'); return; }
        if (expandedPayment === 'card' && !selectedCard) { alert('Please select a card type before proceeding.'); return; }
        if (!expandedPayment && !isCredit) { alert('Please select a payment protocol.'); return; }

        setPaymentStep('processing');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const orderData = {
                buyer_id: user.id,
                supplier_id: selectedSupplier?.id,
                liters: volume,
                distance_km: distance,
                total_cost: currentPricing.total,
                status: 'Pending',
                payment_method: isCredit ? 'Credit' : 'Pay Now',
                priority: 'Normal'
            };

            const { error } = await supabase.from('orders').insert([orderData]);

            if (error) throw error;

            setTimeout(() => {
                setPaymentStep('success');
            }, 1000);

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment failed to execute.');
            setPaymentStep('summary');
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen font-sans text-gray-300 overflow-hidden relative">
            {/* Background FX */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8 relative z-10">

                {/* Main Content: Supplier Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center bg-[#0a0a0a] p-6 rounded-sm shadow-sm border border-gray-800 backdrop-blur-md">
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                Verified Supply Nodes
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] border border-blue-500/20">LIVE</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{city} Operations Hub</p>
                            </div>
                        </div>
                        <div className="text-right border-l border-gray-800 pl-6">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-end gap-1"><Activity className="w-3 h-3 text-blue-500" /> Market Rate</p>
                            <p className="text-xl font-black text-white mt-1">{formatCurrency(CITY_METRICS[city].price)}<span className="text-xs text-blue-400">/L</span></p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            /* Loading Skeleton */
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-[#0a0a0a] p-6 rounded-sm border border-gray-800 flex flex-col gap-6 animate-pulse">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4 w-2/3">
                                            <div className="w-12 h-12 bg-gray-800 rounded-sm"></div>
                                            <div className="space-y-3 w-full">
                                                <div className="h-6 bg-gray-700 rounded w-full"></div>
                                                <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="h-6 bg-gray-700 rounded w-24 mb-2 ml-auto"></div>
                                            <div className="h-3 bg-gray-800 rounded w-16 ml-auto"></div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <div className="h-6 bg-gray-800 rounded w-20"></div>
                                            <div className="h-6 bg-gray-800 rounded w-24"></div>
                                        </div>
                                        <div className="h-10 bg-gray-800 rounded w-32"></div>
                                    </div>
                                </div>
                            ))
                        ) : suppliers.length === 0 ? (
                            /* Empty State */
                            <div className="py-20 text-center bg-[#0a0a0a] rounded-sm border border-gray-800 border-dashed">
                                <Truck className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest mb-2">No Active Nodes</h3>
                                <p className="text-gray-600 font-bold text-sm">There are currently no verified suppliers operating in the {city} hub.</p>
                            </div>
                        ) : (
                            suppliers.map((supplier) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={supplier.id}
                                    className="bg-[#0a0a0a] p-6 rounded-sm border border-gray-800 hover:border-blue-500/50 transition-all group relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Truck Animation on Hover */}
                                    <div className="absolute top-0 right-0 opacity-[0.03] group-hover:opacity-10 translate-x-1/4 group-hover:-translate-x-4 transition-all duration-700">
                                        <Truck className="w-48 h-48 text-blue-500" />
                                    </div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-blue-900/10 rounded-sm flex items-center justify-center text-blue-500 font-black text-xs border border-blue-500/20 group-hover:bg-blue-900/20 transition-colors">
                                                {supplier.rating}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                                    {supplier.name}
                                                    {supplier.is_verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                                                </h3>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                                    ETA: <span className="text-gray-300">{supplier.eta_minutes || supplier.etaMinutes} MINS</span> • DENSITY: <span className="text-gray-300">{supplier.density}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-blue-400">{formatCurrency(supplier.price_per_liter || supplier.pricePerLiter)}</p>
                                            <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                                                <Zap className="w-3 h-3" /> {(supplier.available_liters || supplier.availableLiters).toLocaleString()}L Available
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center relative z-10">
                                        <div className="flex gap-4">
                                            <span className="px-3 py-1 bg-gray-900 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-sm border border-gray-800">
                                                Direct Depot
                                            </span>
                                            <span className="px-3 py-1 bg-yellow-500/10 text-[9px] font-black text-yellow-500 uppercase tracking-widest rounded-sm border border-yellow-500/20">
                                                Instant Payout
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleOrder(supplier)}
                                            className="bg-blue-600/10 text-blue-400 border border-blue-500/50 px-8 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
                                        >
                                            Execute Order
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar: Calculator & Map */}
                <div className="space-y-6">
                    <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm shadow-xl sticky top-24 backdrop-blur-xl relative overflow-hidden group hover:border-blue-900/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Calculator className="w-24 h-24 text-blue-500" /></div>

                        <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4 relative z-10">
                            <Calculator className="w-5 h-5 text-blue-500" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Pricing Terminal</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Volume Axis</label>
                                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-sm border border-yellow-400/20">{volume.toLocaleString()} L</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="100000"
                                    step="1000"
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                    className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-sm appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase mt-1"><span>1k</span><span>100k</span></div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Distance Vector</label>
                                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-sm border border-yellow-400/20">{distance} KM</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="200"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-sm appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase mt-1"><span>1km</span><span>200km</span></div>
                            </div>

                            <div className="bg-black/50 p-4 rounded-sm border border-gray-800 hover:border-gray-700 transition-colors">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                        14-Day Credit Facility
                                    </span>
                                    <div className={`w-8 h-4 rounded-full transition-colors relative border ${isCredit ? 'bg-blue-500 border-blue-400' : 'bg-gray-800 border-gray-700'}`} onClick={() => setIsCredit(!isCredit)}>
                                        <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform ${isCredit ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                                {isCredit && (
                                    <div className="mt-3 text-[10px] font-medium text-gray-400 border-t border-gray-800 pt-3">
                                        Available Facility: <span className="text-white font-black">{formatCurrency(creditLimit)}</span>
                                        {isLimitExceeded && (
                                            <div className="flex items-center gap-1 text-red-500 mt-2 font-black bg-red-500/10 p-2 rounded-sm border border-red-500/20">
                                                <AlertTriangle className="w-3 h-3" /> LIMIT EXCEEDED
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-800 space-y-3">
                                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Core Product</span>
                                    <span className="text-gray-300">{formatCurrency(currentPricing.baseFuelCost)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Logistics Raster</span>
                                    <span className="text-gray-300">{formatCurrency(currentPricing.transportCost)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    <span>Network Fee</span>
                                    <span className="text-gray-300">{formatCurrency(currentPricing.platformFee)}</span>
                                </div>
                                {isCredit && (
                                    <div className="flex justify-between text-[11px] font-bold text-yellow-500 uppercase tracking-wider bg-yellow-500/5 p-1 -mx-1 rounded-sm">
                                        <span>Facility Premium</span>
                                        <span>{formatCurrency(currentPricing.creditSurcharge)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-2xl font-black text-white pt-4 border-t border-gray-800 mt-4 tracking-tighter">
                                    <span className="text-sm self-end pb-1 text-gray-500 uppercase tracking-widest">Total</span>
                                    <span>{formatCurrency(currentPricing.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Tracking Map Component */}
                    <div className="bg-[#0a0a0a] rounded-sm shadow-xl border border-gray-800 h-64 relative overflow-hidden group">
                        {/* Radar Grid */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border border-blue-500/20 rounded-full flex items-center justify-center">
                                <div className="w-32 h-32 border border-blue-500/30 rounded-full flex items-center justify-center relative">
                                    <div className="absolute w-full h-full border-l-2 border-green-500/50 origin-center rounded-full animate-[spin_4s_linear_infinite]"></div>
                                    <div className="w-16 h-16 border border-blue-500/40 rounded-full flex items-center justify-center bg-blue-500/5">
                                        <MapPin className="w-6 h-6 text-blue-500 opacity-50 relative z-10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mock Map Elements */}
                        <div className="absolute top-1/2 left-[40%] w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_10px_rgba(34,197,94,0.5)] z-10">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md px-4 py-3 rounded-sm text-[9px] font-black uppercase text-center border border-gray-800 shadow-xl flex justify-between items-center z-10">
                            <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Active Node</span>
                            <span className="text-white">ID: #8829-XJ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPayment && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="bg-[#0a0a0a] rounded-sm shadow-2xl max-w-lg w-full overflow-hidden border border-gray-800 relative"
                        >
                            {/* Neon Header Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent"></div>

                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-500" /> Authorized Execution
                                </h2>
                                <button onClick={() => { setShowPayment(false); setPaymentStep('summary'); }} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-gray-800 px-3 py-1 rounded-sm hover:bg-white/5 transition-colors">Abort</button>
                            </div>

                            <div className="p-8">
                                {paymentStep === 'summary' && (
                                    <div className="space-y-6">
                                        <div className="bg-black/50 p-5 rounded-sm border border-gray-800">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <AlertTriangle className="w-3 h-3 text-yellow-500" /> Transaction Manifest
                                            </p>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="font-black text-white text-lg">{volume.toLocaleString()} L</span>
                                                <span className="font-black text-blue-400 text-2xl">{formatCurrency(currentPricing.total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-t border-gray-800 pt-3 mt-3 uppercase tracking-widest">
                                                <span>NODE: <span className="text-gray-300">{selectedSupplier?.name}</span></span>
                                                <span>VECTOR: <span className="text-gray-300">{distance}km</span></span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Protocol Selection</h3>

                                            {/* Bank Transfer Option */}
                                            <div className="border border-blue-500/30 bg-blue-500/5 rounded-sm overflow-hidden transition-all group/transfer">
                                                <button
                                                    onClick={() => setExpandedPayment(expandedPayment === 'transfer' ? null : 'transfer')}
                                                    className={`w-full flex items-center justify-between p-4 font-black text-[11px] uppercase tracking-widest transition-colors ${expandedPayment === 'transfer' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-blue-400 hover:bg-white/5'}`}
                                                >
                                                    <span className="flex items-center gap-3"><Building2 className="w-4 h-4 group-hover/transfer:scale-110 transition-transform" /> Pay by Transfer</span>
                                                    {expandedPayment === 'transfer' ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 opacity-50 group-hover/transfer:opacity-100" />}
                                                </button>

                                                <AnimatePresence>
                                                    {expandedPayment === 'transfer' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-blue-500/30 bg-black/30 p-4"
                                                        >
                                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-3">Select Receiving Bank</p>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {NIGERIAN_BANKS.map(bank => (
                                                                    <button
                                                                        key={bank.id}
                                                                        onClick={() => setSelectedBank(bank.id)}
                                                                        className={`flex items-center gap-2 p-3 border rounded-sm transition-all ${selectedBank === bank.id ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-gray-800 bg-black/20 hover:border-gray-600'}`}
                                                                    >
                                                                        <div className={`w-4 h-4 rounded-sm ${bank.color}`}></div>
                                                                        <span className={`text-[10px] font-bold ${selectedBank === bank.id ? 'text-blue-400' : 'text-gray-400'} uppercase`}>{bank.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Pay by Card Option */}
                                            <div className="border border-blue-500/30 bg-blue-500/5 rounded-sm overflow-hidden transition-all group/card">
                                                <button
                                                    onClick={() => setExpandedPayment(expandedPayment === 'card' ? null : 'card')}
                                                    className={`w-full flex items-center justify-between p-4 font-black text-[11px] uppercase tracking-widest transition-colors ${expandedPayment === 'card' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-blue-400 hover:bg-white/5'}`}
                                                >
                                                    <span className="flex items-center gap-3"><CreditCard className="w-4 h-4 group-hover/card:scale-110 transition-transform" /> Pay by Card</span>
                                                    {expandedPayment === 'card' ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 opacity-50 group-hover/card:opacity-100" />}
                                                </button>

                                                <AnimatePresence>
                                                    {expandedPayment === 'card' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="border-t border-blue-500/30 bg-black/30 p-4"
                                                        >
                                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-3">Select Card Platform</p>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {CARD_TYPES.map(card => (
                                                                    <button
                                                                        key={card.id}
                                                                        onClick={() => setSelectedCard(card.id)}
                                                                        className={`flex flex-col items-center gap-2 p-3 border rounded-sm transition-all ${selectedCard === card.id ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-gray-800 bg-black/20 hover:border-gray-600'}`}
                                                                    >
                                                                        <div className={`w-8 h-5 rounded-sm ${card.color} shadow-sm border border-white/10`}></div>
                                                                        <span className={`text-[9px] font-bold ${selectedCard === card.id ? 'text-blue-400' : 'text-gray-400'} uppercase mt-1`}>{card.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button
                                                disabled={!isCredit || isLimitExceeded}
                                                onClick={() => setExpandedPayment('credit')}
                                                className={`w-full flex items-center justify-between p-4 border rounded-sm font-black text-[11px] uppercase tracking-widest transition-colors group ${!isCredit
                                                    ? 'border-gray-800 text-gray-600 bg-black/20 opacity-50'
                                                    : isLimitExceeded
                                                        ? 'border-red-900/50 text-red-500 bg-red-900/10'
                                                        : expandedPayment === 'credit'
                                                            ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                                                            : 'border-blue-500/30 bg-blue-500/5 text-gray-400 hover:text-blue-400 hover:bg-white/5'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> 14-Day Corporate Facility</span>
                                                {isLimitExceeded ? <span className="text-[9px] text-red-500 uppercase font-black bg-red-500/10 px-2 py-1 rounded-sm">Limit Breached</span> : expandedPayment === 'credit' ? <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div> : <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                                            </button>
                                        </div>

                                        <button onClick={processPayment} className="w-full bg-blue-600 text-white py-4 font-black text-xs uppercase tracking-widest rounded-sm hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)] mt-4">Initialize Sequence</button>
                                    </div>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="text-center py-12">
                                        <div className="relative w-20 h-20 mx-auto mb-8">
                                            <div className="absolute inset-0 border-2 border-gray-800 rounded-full"></div>
                                            <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                            <Activity className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                                        </div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Executing Block</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Handshaking with financial grid...</p>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                            <ShieldCheck className="w-10 h-10 text-green-400" />
                                        </div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Sequence Confirmed</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-10 bg-black/50 py-2 rounded-sm border border-gray-800 inline-block px-4">
                                            Logistics ID <span className="text-green-400">#8829-XJ</span> queued for <span className="text-white">{selectedSupplier?.name}</span>
                                        </p>
                                        <button onClick={() => { setShowPayment(false); setPaymentStep('summary'); }} className="w-full border border-gray-700 text-white py-4 rounded-sm font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-colors">Return to Dashboard</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuyerDashboard;
