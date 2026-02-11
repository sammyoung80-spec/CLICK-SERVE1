'use client';

import React, { useState } from 'react';
import { MOCK_SUPPLIERS, CITY_METRICS, CREDIT_LIMITS } from '@/lib/constants';
import { calculateBuyerTotal, formatCurrency } from '@/utils/pricing';
import { City, Supplier } from '@/types';
import { Truck, AlertTriangle, ShieldCheck, MapPin, Calculator, CreditCard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const currentPricing = calculateBuyerTotal(CITY_METRICS[city].price, volume, distance, isCredit);
    const creditLimit = CREDIT_LIMITS[businessType];
    const isLimitExceeded = isCredit && currentPricing.total > creditLimit;

    // Filter suppliers by city
    const suppliers = MOCK_SUPPLIERS.filter(s => s.city === city);

    const handleOrder = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowPayment(true);
    };

    const processPayment = () => {
        setPaymentStep('processing');
        setTimeout(() => {
            setPaymentStep('success');
        }, 2000);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

                {/* Main Content: Supplier Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                        <div>
                            <h1 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Verified Supply Nodes</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{city} Operations Hub</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Rate</p>
                            <p className="text-lg font-black text-blue-900">{formatCurrency(CITY_METRICS[city].price)}<span className="text-xs text-gray-400">/L</span></p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {suppliers.map((supplier) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={supplier.id}
                                className="bg-white p-6 rounded-sm border border-gray-100 hover:border-blue-900 transition-all group relative overflow-hidden"
                            >
                                {/* Truck Animation on Hover */}
                                <div className="absolute top-0 right-0 opacity-10 translate-x-full group-hover:translate-x-0 transition-transform duration-700">
                                    <Truck className="w-32 h-32 text-blue-900" />
                                </div>

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-sm flex items-center justify-center text-blue-900 font-black text-xs border border-blue-100">
                                            {supplier.rating}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight flex items-center gap-2">
                                                {supplier.name}
                                                {supplier.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                                            </h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                ETA: {supplier.etaMinutes} MINS • DENSITY: {supplier.density}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-blue-900">{formatCurrency(supplier.pricePerLiter)}</p>
                                        <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
                                            {supplier.availableLiters.toLocaleString()}L Available
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center relative z-10">
                                    <div className="flex gap-4">
                                        <span className="px-3 py-1 bg-gray-50 text-[9px] font-black text-gray-500 uppercase tracking-widest rounded-sm">
                                            Direct Depot
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-50 text-[9px] font-black text-yellow-600 uppercase tracking-widest rounded-sm border border-yellow-100">
                                            Instant Payout
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleOrder(supplier)}
                                        className="bg-blue-900 text-white px-6 py-2 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg active:scale-95"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Calculator & Map */}
                <div className="space-y-6">
                    <div className="bg-blue-900 text-white p-6 rounded-sm shadow-xl sticky top-24">
                        <div className="flex items-center gap-2 mb-6 border-b border-blue-800 pb-4">
                            <Calculator className="w-5 h-5 text-yellow-400" />
                            <h2 className="text-sm font-black uppercase tracking-widest">Logistics Calculator</h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Volume Required</label>
                                    <span className="text-[10px] font-bold text-yellow-400">{volume.toLocaleString()} L</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="100000"
                                    step="1000"
                                    value={volume}
                                    onChange={(e) => setVolume(Number(e.target.value))}
                                    className="w-full accent-yellow-400 h-1 bg-blue-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="text-[9px] font-black text-blue-300 uppercase tracking-widest">Delivery Distance</label>
                                    <span className="text-[10px] font-bold text-yellow-400">{distance} KM</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="200"
                                    value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="w-full accent-yellow-400 h-1 bg-blue-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="bg-blue-800/50 p-4 rounded-sm border border-blue-700">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Credit Facility (14 Days)
                                    </span>
                                    <div className={`w-8 h-4 rounded-full transition-colors relative ${isCredit ? 'bg-yellow-400' : 'bg-gray-600'}`} onClick={() => setIsCredit(!isCredit)}>
                                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isCredit ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                                {isCredit && (
                                    <div className="mt-3 text-[9px] font-medium text-blue-200 border-t border-blue-700 pt-2">
                                        Credit Limit: <span className="text-white font-bold">{formatCurrency(creditLimit)}</span>
                                        {isLimitExceeded && (
                                            <div className="flex items-center gap-1 text-red-400 mt-1 font-bold">
                                                <AlertTriangle className="w-3 h-3" /> Limit Exceeded
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-blue-800 space-y-2">
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Fuel Cost</span>
                                    <span>{formatCurrency(currentPricing.baseFuelCost)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Logistics</span>
                                    <span>{formatCurrency(currentPricing.transportCost)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-blue-200">
                                    <span>Platform Fee</span>
                                    <span>{formatCurrency(currentPricing.platformFee)}</span>
                                </div>
                                {isCredit && (
                                    <div className="flex justify-between text-xs text-yellow-400">
                                        <span>Credit Surcharge</span>
                                        <span>{formatCurrency(currentPricing.creditSurcharge)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-black text-white pt-2 border-t border-blue-800 mt-2">
                                    <span>Total</span>
                                    <span>{formatCurrency(currentPricing.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Tracking Map Placeholder */}
                    <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 h-64 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                            <div className="text-center opacity-50">
                                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Fleet Map</p>
                            </div>
                        </div>
                        {/* Mock Map Elements */}
                        <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-blue-300 rounded-full -translate-x-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-900 rounded-full border-2 border-white shadow-lg -translate-y-1/2 animate-bounce"></div>
                        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-sm text-[8px] font-black uppercase shadow-sm">
                            Tracking ID: #8829-XJ
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPayment && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-sm shadow-2xl max-w-lg w-full overflow-hidden"
                        >
                            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
                                <h2 className="text-lg font-black uppercase tracking-tight">Secure Checkout</h2>
                                <button onClick={() => { setShowPayment(false); setPaymentStep('summary'); }} className="text-blue-300 hover:text-white">Close</button>
                            </div>

                            <div className="p-8">
                                {paymentStep === 'summary' && (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Summary</p>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-blue-900">{volume.toLocaleString()} Liters AGO</span>
                                                <span className="font-bold text-blue-900">{formatCurrency(currentPricing.total)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Supplier: {selectedSupplier?.name}</span>
                                                <span>{distance}km Delivery</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest">Select Payment Method</h3>
                                            <button className="w-full flex items-center justify-between p-4 border border-blue-900 bg-blue-50 text-blue-900 rounded-sm font-bold text-xs hover:bg-blue-100">
                                                <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Bank Transfer (NIBSS)</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                disabled={!isCredit || isLimitExceeded}
                                                className={`w-full flex items-center justify-between p-4 border rounded-sm font-bold text-xs ${!isCredit ? 'border-gray-200 text-gray-300' : 'border-gray-200 hover:border-blue-900 text-gray-700'}`}
                                            >
                                                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Trade Credit (14 Days)</span>
                                                {isLimitExceeded ? <span className="text-[9px] text-red-500 uppercase font-black">Limit Exceeded</span> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        <button onClick={processPayment} className="w-full bg-blue-900 text-white py-4 font-black uppercase tracking-widest rounded-sm hover:bg-black shadow-lg">Confirm Payment</button>
                                    </div>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-900 rounded-full animate-spin mx-auto mb-6"></div>
                                        <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight mb-2">Processing Transaction</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Connecting to Interswitch Gateway...</p>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
                                            <ShieldCheck className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight mb-2">Payment Successful</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-8">Order ID #8829-XJ Dispatched to {selectedSupplier?.name}</p>
                                        <button onClick={() => { setShowPayment(false); setPaymentStep('summary'); }} className="bg-blue-900 text-white px-8 py-3 rounded-sm font-black uppercase tracking-widest hover:bg-black">Return to Dashboard</button>
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
