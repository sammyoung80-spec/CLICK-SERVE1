'use client';

import React from 'react';
import { MOCK_SUPPLIERS } from '@/lib/constants';
import { formatCurrency } from '@/utils/pricing';
import { ShieldCheck } from 'lucide-react';

const SuppliersList: React.FC = () => {
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
                    {MOCK_SUPPLIERS.map(supplier => (
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

                            <button className="w-full bg-gray-100 text-gray-400 py-3 rounded-sm font-black uppercase tracking-widest text-xs cursor-not-allowed group-hover:bg-blue-900 group-hover:text-white transition-colors">
                                Login to Order
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuppliersList;
