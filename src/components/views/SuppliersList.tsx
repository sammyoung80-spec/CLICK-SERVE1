'use client';

import React, { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/utils/pricing';
import { ShieldCheck } from 'lucide-react';

interface SuppliersListProps {
    onLoginClick?: () => void;
}

const SuppliersList: React.FC<SuppliersListProps> = ({ onLoginClick }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const { data, error } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('is_verified', true);

                if (error) throw error;
                if (data) {
                    const formatted = data.map(s => ({
                        ...s,
                        pricePerLiter: s.price_per_liter,
                        availableLiters: s.available_liters,
                        verificationStatus: s.verification_status,
                        etaMinutes: s.eta_minutes,
                        isVerified: s.is_verified
                    })) as Supplier[];
                    setSuppliers(formatted);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen font-sans py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">Live Marketplace</h1>
                        <p className="text-gray-500 font-medium mt-2">View real-time terminal prices across Nigeria. Login to secure liquidity and place orders.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        /* Loading Skeleton */
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 flex flex-col gap-6 animate-pulse">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3 w-2/3">
                                        <div className="h-6 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-10 h-10 bg-gray-100 rounded-sm"></div>
                                </div>
                                <div>
                                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50">
                                    <div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                    <div>
                                        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                                <div className="h-12 bg-gray-100 rounded-sm w-full"></div>
                            </div>
                        ))
                    ) : suppliers.length === 0 ? (
                        /* Empty State */
                        <div className="col-span-full py-20 text-center bg-white rounded-sm border border-gray-100 border-dashed">
                            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest mb-2">No Active Nodes</h3>
                            <p className="text-gray-500 font-bold text-sm">There are currently no verified suppliers on the network.</p>
                        </div>
                    ) : (
                        suppliers.map(supplier => (
                            <div key={supplier.id} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-900 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight flex items-center gap-2">
                                            {supplier.name}
                                            {supplier.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                                        </h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{supplier.city} Terminal</p>
                                    </div>
                                    <div className="w-10 h-10 bg-blue-50 rounded-sm flex items-center justify-center text-blue-900 font-black text-xs">
                                        {supplier.rating}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-3xl font-black text-blue-900">{formatCurrency(supplier.pricePerLiter)}<span className="text-sm font-bold text-gray-400">/L</span></p>
                                    <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mt-1">Available to load immediately</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-gray-50 py-4">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Density</p>
                                        <p className="text-sm font-black text-blue-900">{supplier.density}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Load Time</p>
                                        <p className="text-sm font-black text-blue-900">{supplier.etaMinutes} Mins</p>
                                    </div>
                                </div>

                                <button
                                    onClick={onLoginClick}
                                    className="w-full bg-blue-50 text-blue-900 py-3 rounded-sm font-black uppercase tracking-widest text-xs cursor-pointer hover:bg-blue-900 hover:text-white transition-colors"
                                    title="Click to log in and place an order"
                                >
                                    Login to Order
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuppliersList;
