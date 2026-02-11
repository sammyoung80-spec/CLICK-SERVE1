'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_ORDERS, CITY_METRICS } from '@/lib/constants';
import { calculateInvoiceDiscounting, formatCurrency } from '@/utils/pricing';
import { Order } from '@/types';
import { Truck, Coins, BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierDashboard: React.FC = () => {
    const [terminalPrice, setTerminalPrice] = useState(1080);
    const [availableStock, setAvailableStock] = useState(132000);
    const [isLiquidating, setIsLiquidating] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

    const pendingInvoices = useMemo(() => MOCK_ORDERS.filter(o => o.status === 'Delivered'), []);
    const activeOrders = useMemo(() => MOCK_ORDERS.filter(o => o.status === 'In Transit' || o.status === 'Pending'), []);

    // Calculate liquidity for modal
    const liquidityCalc = selectedInvoice ? calculateInvoiceDiscounting(selectedInvoice.totalCost) : null;

    return (
        <div className="bg-slate-50 min-h-screen font-sans p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Top Control Bar */}
                <div className="bg-blue-900 text-white p-8 rounded-sm shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-400 opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-400 rounded-sm text-blue-900"><Truck className="w-5 h-5" /></div>
                                <h1 className="text-2xl font-black uppercase tracking-tighter">Terminal Command</h1>
                            </div>
                            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest pl-1">Oando Terminal A • LAGOS HUB</p>
                        </div>

                        <div className="flex gap-8">
                            <div className="text-center">
                                <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Current Stock</p>
                                <p className="text-2xl font-black">{availableStock.toLocaleString()}<span className="text-sm font-bold text-gray-400">L</span></p>
                            </div>
                            <div className="h-10 w-px bg-blue-700"></div>
                            <div className="text-center">
                                <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">Gate Price</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setTerminalPrice(p => p - 5)} className="text-yellow-400 hover:text-white text-xl font-bold">-</button>
                                    <p className="text-2xl font-black">{formatCurrency(terminalPrice)}</p>
                                    <button onClick={() => setTerminalPrice(p => p + 5)} className="text-yellow-400 hover:text-white text-xl font-bold">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Feed */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                            <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Live Dispatch Feed
                            </h2>
                            <span className="bg-green-100 text-green-700 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-wide animate-pulse">Live</span>
                        </div>
                        <div className="space-y-4">
                            {activeOrders.map(order => (
                                <div key={order.id} className="p-4 bg-slate-50 border-l-4 border-blue-900 rounded-r-sm hover:bg-slate-100 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xs font-black text-blue-900 uppercase">{order.buyerName}</h3>
                                        <span className={`text-[8px] font-bold uppercase px-2 py-1 rounded-sm ${order.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-gray-200 text-gray-500'}`}>{order.priority} PRIORITY</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase spacing-x-2">
                                            <span>{order.liters.toLocaleString()} Liters</span> • <span>{order.distanceKm}KM Distance</span>
                                        </div>
                                        <p className="text-sm font-black text-blue-900">{formatCurrency(order.totalCost)}</p>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button className="flex-1 bg-white border border-gray-200 text-[9px] font-black text-blue-900 py-2 uppercase hover:bg-blue-50">View Manifest</button>
                                        <button className="flex-1 bg-blue-900 text-white text-[9px] font-black py-2 uppercase hover:bg-black">Authorize Dispatch</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Liquidity Hub */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                            <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                <Coins className="w-4 h-4 text-yellow-500" /> Liquidity Hub
                            </h2>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Available to Discount: {pendingInvoices.length}</p>
                        </div>

                        <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
                            {pendingInvoices.length > 0 ? pendingInvoices.map(invoice => (
                                <div key={invoice.id} className="border border-gray-100 p-5 rounded-sm relative group hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Invoice #{invoice.id}</p>
                                            <h3 className="text-sm font-black text-blue-900 uppercase">{invoice.buyerName}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-400 line-through decoration-red-500 decoration-2">Net 14 Days</p>
                                            <p className="text-lg font-black text-blue-900">{formatCurrency(invoice.totalCost)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-3 rounded-sm flex justify-between items-center">
                                        <span className="text-[9px] font-black text-yellow-700 uppercase tracking-widest flex items-center gap-2">
                                            <TrendingUp className="w-3 h-3" /> Get Paid Today
                                        </span>
                                        <button
                                            onClick={() => { setSelectedInvoice(invoice); setIsLiquidating(true); }}
                                            className="bg-blue-900 text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-black rounded-sm shadow-sm"
                                        >
                                            Liquidate Now
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                    <CheckCircle2 className="w-12 h-12 mb-2" />
                                    <p className="text-xs font-black uppercase tracking-widest">No Pending Invoices</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Liquidity Modal */}
                <AnimatePresence>
                    {isLiquidating && liquidityCalc && selectedInvoice && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white max-w-lg w-full rounded-sm shadow-2xl overflow-hidden"
                            >
                                <div className="bg-blue-900 p-6 flex justify-between items-center text-white">
                                    <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-yellow-400" /> Early Liquidity Offer
                                    </h2>
                                    <button onClick={() => setIsLiquidating(false)} className="opacity-50 hover:opacity-100"><X className="w-5 h-5" /></button>
                                </div>

                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Invoice Value</p>
                                        <p className="text-2xl font-black text-blue-900 mb-2">{formatCurrency(liquidityCalc.invoiceValue)}</p>
                                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">From {selectedInvoice.buyerName}</p>
                                    </div>

                                    <div className="space-y-4 border-t border-b border-gray-100 py-6 mb-8">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-gray-500 uppercase">Discount Rate (3.5%)</span>
                                            <span className="font-black text-red-500">-{formatCurrency(liquidityCalc.discountingFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-gray-500 uppercase">Processing Fee</span>
                                            <span className="font-black text-red-500">-{formatCurrency(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg pt-4 border-t border-dashed border-gray-200">
                                            <span className="font-black text-blue-900 uppercase">Instant Payout</span>
                                            <span className="font-black text-green-600">{formatCurrency(liquidityCalc.liquidityPayout)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-sm mb-6 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                        <p className="text-[9px] font-bold text-yellow-800 leading-relaxed uppercase">
                                            By accepting, you assign this invoice receivable to Click & Serve Finance Ltd. Funds will be settled to your wallet immediately.
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setIsLiquidating(false)} className="flex-1 py-4 border border-gray-200 font-black uppercase tracking-widest text-xs text-gray-400 hover:text-gray-600">Decline</button>
                                        <button onClick={() => { alert('Funds Disbursed'); setIsLiquidating(false); }} className="flex-[2] bg-green-600 text-white font-black uppercase tracking-widest text-xs hover:bg-green-700 shadow-lg">
                                            Accept Payout
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default SupplierDashboard;
