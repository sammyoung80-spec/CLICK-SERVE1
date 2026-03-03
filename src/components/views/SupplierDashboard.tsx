'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CITY_METRICS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { calculateInvoiceDiscounting, formatCurrency } from '@/utils/pricing';
import { Order, Supplier } from '@/types';
import { Truck, Coins, BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp, X, Activity, Zap, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SupplierDashboard: React.FC = () => {
    const [terminalPrice, setTerminalPrice] = useState(1080);
    const [availableStock, setAvailableStock] = useState(132000);
    const [isLiquidating, setIsLiquidating] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
    const [supplierData, setSupplierData] = useState<Supplier | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupplierAndOrders = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Fetch Supplier Profile
                const { data: supData, error: supError } = await supabase
                    .from('suppliers')
                    .select('*')
                    .eq('profile_id', user.id)
                    .single();

                if (supError) {
                    // Fallback for demo users
                    const { data: backupSup, error: backupError } = await supabase
                        .from('suppliers')
                        .select('*')
                        .limit(1)
                        .single();

                    if (backupSup) setSupplierData(backupSup as Supplier);
                } else if (supData) {
                    setSupplierData(supData as Supplier);
                }

                const targetSupplierId = supData ? supData.id : (supplierData?.id || null);

                // 2. Fetch Orders for this supplier
                if (targetSupplierId) {
                    const { data: ordersData, error: ordersError } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('supplier_id', targetSupplierId)
                        .order('created_at', { ascending: false });

                    if (!ordersError && ordersData) {
                        const formattedOrders = ordersData.map(o => ({
                            ...o,
                            totalCost: o.total_cost,
                            distanceKm: o.distance_km,
                            buyerName: o.buyer_name // Just in case it's in the DB
                        })) as Order[];
                        setOrders(formattedOrders);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplierAndOrders();
    }, []);

    const pendingInvoices = useMemo(() => orders.filter(o => o.status === 'Delivered'), [orders]);
    const activeOrders = useMemo(() => orders.filter(o => o.status === 'In Transit' || o.status === 'Pending'), [orders]);

    // Calculate liquidity for modal
    const liquidityCalc = selectedInvoice ? calculateInvoiceDiscounting(selectedInvoice.totalCost) : null;

    const executeLiquidation = async () => {
        if (!selectedInvoice) return;
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'Paid' })
                .eq('id', selectedInvoice.id);

            if (error) throw error;

            alert('Funds Disbursed to Wallet via NIBSS.');
            setOrders(prev => prev.map(o => o.id === selectedInvoice.id ? { ...o, status: 'Paid' } : o));
            setIsLiquidating(false);
            setSelectedInvoice(null);
        } catch (error) {
            console.error('Liquidation error', error);
            alert('Failed to execute liquidation.');
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen font-sans p-6 md:p-8 text-gray-300 relative overflow-hidden">
            {/* Background FX */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-green-900/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Top Control Bar */}
                <div className="bg-[#0a0a0a] border border-gray-800 p-8 rounded-sm shadow-2xl relative overflow-hidden backdrop-blur-xl group">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-colors duration-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-sm text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Activity className="w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Terminal Command</h1>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        {supplierData ? `${supplierData.name} • ${supplierData.city} HUB` : 'SUPPLIER HUB'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-10 items-center">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Current Stock</p>
                                <p className="text-3xl font-black text-white tracking-tighter">{availableStock.toLocaleString()}<span className="text-sm font-bold text-blue-500 ml-1">L</span></p>
                            </div>
                            <div className="h-12 w-px bg-gray-800"></div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Gate Price</p>
                                <div className="flex items-center gap-3 bg-black/50 px-3 py-1 rounded-sm border border-gray-800">
                                    <button onClick={() => setTerminalPrice(p => p - 5)} className="text-blue-500/50 hover:text-blue-400 text-xl font-bold transition-colors">-</button>
                                    <p className="text-2xl font-black text-white w-24 text-center">{formatCurrency(supplierData?.pricePerLiter || terminalPrice)}</p>
                                    <button onClick={() => setTerminalPrice(p => p + 5)} className="text-blue-500/50 hover:text-blue-400 text-xl font-bold transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Feed */}
                    <div className="bg-[#0a0a0a] rounded-sm shadow-xl border border-gray-800 p-6 backdrop-blur-md relative overflow-hidden group hover:border-gray-700 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Clock className="w-32 h-32 text-blue-500" /></div>

                        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 relative z-10">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-500" /> Live Dispatch Feed
                            </h2>
                            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] px-3 py-1 rounded-sm font-black uppercase tracking-wide animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.2)]">Live Grid</span>
                        </div>

                        <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-5 bg-black/40 border-l-2 border-gray-800 rounded-r-sm animate-pulse border-y border-r">
                                        <div className="h-4 bg-gray-800 rounded w-1/3 mb-4"></div>
                                        <div className="flex justify-between mt-2">
                                            <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))
                            ) : activeOrders.length > 0 ? (
                                activeOrders.map(order => (
                                    <div key={order.id} className="p-5 bg-black/40 border-l-2 border-blue-500 rounded-r-sm hover:bg-white/5 transition-all border-y border-r border-gray-800/50 group/item">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xs font-black text-white uppercase tracking-wider">{order.buyerName || `Buyer #${order.buyer_id?.substring(0, 6) || 'UNKNOWN'}`}</h3>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm border ${order.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                                {order.priority || 'NORMAL'} PRIORITY
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] text-gray-500 font-bold uppercase flex gap-3">
                                                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-blue-500" /> {order.liters.toLocaleString()} L</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {order.distanceKm || 0} KM</span>
                                            </div>
                                            <p className="text-sm font-black text-blue-400">{formatCurrency(order.totalCost)}</p>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <button className="flex-1 bg-transparent border border-gray-700 text-[9px] font-black text-gray-400 py-2.5 uppercase tracking-widest hover:border-gray-500 hover:text-white transition-colors rounded-sm">View Node</button>
                                            <button className="flex-1 bg-blue-600/10 border border-blue-500/50 text-blue-400 text-[9px] font-black py-2.5 uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.1)] group-hover/item:shadow-[0_0_15px_rgba(59,130,246,0.3)]">Authorize Output</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 opacity-50">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-[10px] font-bold uppercase">No Active Orders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Liquidity Hub */}
                    <div className="bg-[#0a0a0a] rounded-sm shadow-xl border border-gray-800 p-6 backdrop-blur-md relative overflow-hidden group hover:border-gray-700 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Coins className="w-32 h-32 text-green-500" /></div>

                        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 relative z-10">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" /> Liquidity Matrix
                            </h2>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest border border-gray-800 px-2 py-1 rounded-sm">Pending Yield: {pendingInvoices.length}</p>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 relative z-10 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="border border-gray-800 bg-black/20 p-5 rounded-sm animate-pulse">
                                        <div className="h-3 bg-gray-800 rounded w-1/4 mb-4"></div>
                                        <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
                                        <div className="h-8 bg-gray-800 rounded w-1/3 ml-auto"></div>
                                    </div>
                                ))
                            ) : pendingInvoices.length > 0 ? pendingInvoices.map(invoice => (
                                <div key={invoice.id} className="border border-gray-800 bg-black/20 p-5 rounded-sm relative group/inv hover:border-green-500/30 transition-all hover:bg-black/40">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 font-mono">ID: {invoice.id.substring(0, 8)}...</p>
                                            <h3 className="text-xs font-black text-white uppercase tracking-wider">{invoice.buyerName || `Buyer #${invoice.buyer_id?.substring(0, 6)}`}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-600 line-through decoration-red-500/50 decoration-2 uppercase tracking-widest mb-1">Net 14 Days</p>
                                            <p className="text-lg font-black text-white">{formatCurrency(invoice.totalCost)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-sm flex justify-between items-center mt-2 group-hover/inv:bg-green-500/10 transition-colors">
                                        <span className="text-[9px] font-black text-green-400 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3 h-3 animate-pulse" /> Instant Settlement Available
                                        </span>
                                        <button
                                            onClick={() => { setSelectedInvoice(invoice); setIsLiquidating(true); }}
                                            className="bg-green-600 text-white px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-green-500 transition-colors rounded-sm shadow-[0_0_10px_rgba(22,163,74,0.3)] hover:shadow-[0_0_15px_rgba(22,163,74,0.5)] active:scale-95"
                                        >
                                            Liquidate
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 py-20">
                                    <CheckCircle2 className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="text-xs font-black uppercase tracking-widest">No Pending Yields</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Liquidity Modal */}
                <AnimatePresence>
                    {isLiquidating && liquidityCalc && selectedInvoice && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="bg-[#0a0a0a] max-w-lg w-full rounded-sm shadow-2xl overflow-hidden border border-gray-800 relative"
                            >
                                {/* Neon Header Line */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-green-400 to-transparent"></div>

                                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-500" /> Liquidity Execution
                                    </h2>
                                    <button onClick={() => setIsLiquidating(false)} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-gray-800 px-3 py-1 rounded-sm hover:bg-white/5 transition-colors">Abort</button>
                                </div>

                                <div className="p-8">
                                    <div className="text-center mb-8 bg-black/30 p-6 rounded-sm border border-gray-800 shadow-inner">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2"><Clock className="w-3 h-3 text-red-500" /> Pending Invoice Value</p>
                                        <p className="text-3xl font-black text-white mb-2 tracking-tighter">{formatCurrency(liquidityCalc.invoiceValue)}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono bg-gray-900 inline-block px-3 py-1 rounded-sm border border-gray-800">Target: {selectedInvoice.buyerName || `Buyer #${selectedInvoice.buyer_id?.substring(0, 6)}`}</p>
                                    </div>

                                    <div className="space-y-4 border-t border-b border-gray-800 py-6 mb-8 mt-4">
                                        <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span>Network Rate (3.5%)</span>
                                            <span className="font-black text-red-400">-{formatCurrency(liquidityCalc.discountingFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <span>Execution Gas</span>
                                            <span className="font-black text-red-400">-{formatCurrency(0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl pt-5 border-t border-dashed border-gray-800 mt-2 tracking-tighter">
                                            <span className="font-black text-white uppercase text-sm self-end pb-1 tracking-widest">Net Payout</span>
                                            <span className="font-black text-green-400 bg-green-500/10 px-3 py-1 rounded-sm border border-green-500/20">{formatCurrency(liquidityCalc.liquidityPayout)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-sm mb-8 flex gap-3 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-[9px] font-bold text-blue-200/70 leading-relaxed uppercase tracking-widest">
                                            By executing, receivable ID <span className="text-white bg-black/50 px-1 py-0.5 rounded-sm font-mono border border-gray-800">{selectedInvoice.id}</span> is assigned to the Click&Serve Liquidity Pool. Settlement triggers instantly via NIBSS.
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setIsLiquidating(false)} className="flex-[1] py-4 border border-gray-800 font-black uppercase tracking-widest text-xs text-gray-500 hover:text-white hover:border-gray-600 transition-colors rounded-sm bg-black/50">Decline</button>
                                        <button onClick={() => executeLiquidation()} className="flex-[2] bg-green-600 text-white font-black uppercase tracking-widest text-xs hover:bg-green-500 transition-colors rounded-sm shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)] active:scale-95">
                                            Authorize Settlement
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
