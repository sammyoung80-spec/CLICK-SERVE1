'use client';

import React, { useState, useEffect } from 'react';
import { SYSTEM_LOGS, CITY_METRICS } from '@/lib/constants';
import { Supplier, Order } from '@/types';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Users, Truck, AlertTriangle, FileText, LayoutGrid, Map as MapIcon, Settings, Search, MoreVertical, X, CheckCircle2, Clock, Activity, Terminal, Database, Shield } from 'lucide-react';
import { formatCurrency } from '@/utils/pricing';

const AdminDashboard: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState('suppliers');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [buyers, setBuyers] = useState<any[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [approvals, setApprovals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Suppliers
                const { data: suppliersData, error: suppliersError } = await supabase
                    .from('suppliers')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (suppliersError) throw suppliersError;

                // Map DB snake_case to frontend camelCase if needed, 
                // but checking types/index.ts, Supplier expects camelCase for some fields
                const formattedSuppliers = (suppliersData || []).map(s => ({
                    ...s,
                    pricePerLiter: s.price_per_liter,
                    availableLiters: s.available_liters,
                    verificationStatus: s.verification_status,
                    etaMinutes: s.eta_minutes,
                    isVerified: s.is_verified
                }));

                setSuppliers(formattedSuppliers);

                // 2. Fetch Buyers (from Profiles where role is buyer)
                const { data: buyersData, error: buyersError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'buyer');

                if (buyersError) throw buyersError;

                // Add mock credit stats for buyers since profiles table doesn't have them yet
                const formattedBuyers = (buyersData || []).map(b => ({
                    id: b.id,
                    name: b.business_name || b.full_name || 'Individual Buyer',
                    city: b.city || 'Lagos',
                    volume: 'Medium',
                    creditScore: 750,
                    creditLimit: 15000000,
                    utilizedCredit: 0,
                    status: 'Active'
                }));

                setBuyers(formattedBuyers);

                // 3. Fetch Orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*, profiles(business_name, full_name)')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                const formattedOrders = (ordersData || []).map(o => ({
                    id: o.id,
                    buyerName: (o.profiles as any)?.business_name || (o.profiles as any)?.full_name || 'Unknown Buyer',
                    liters: o.liters,
                    distanceKm: o.distance_km,
                    totalCost: o.total_cost,
                    status: o.status,
                    paymentMethod: o.payment_method,
                    timestamp: o.created_at,
                    priority: o.priority
                }));

                setOrders(formattedOrders as Order[]);

                // 4. Fetch Approvals (Any profile not yet marked as approved)
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*');

                if (!profilesError && profilesData) {
                    // Filter for buyers/suppliers who are not yet approved
                    // We handle missing column gracefully by checking if key exists
                    const pending = profilesData.filter(p =>
                        (p.role === 'buyer' || p.role === 'supplier') &&
                        (p.is_approved === false)
                    );
                    setApprovals(pending);
                }

            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const toggleSupplierStatus = async (id: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus;
            const { error } = await supabase
                .from('suppliers')
                .update({
                    is_verified: newStatus,
                    verification_status: newStatus ? 'Verified' : 'Pending'
                })
                .eq('id', id);

            if (error) throw error;

            setSuppliers(prev => prev.map(s => s.id === id ? {
                ...s,
                isVerified: newStatus,
                verificationStatus: newStatus ? 'Verified' : 'Pending'
            } : s));
        } catch (error) {
            console.error('Error updating supplier status:', error);
            alert('Failed to update verification status.');
        }
    };

    const toggleBuyerStatus = (id: string) => {
        // Since profiles don't have status yet, we'll keep this local for now
        setBuyers(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Active' ? 'Suspended' : 'Active' } : b));
    };

    const menuItems = [
        { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-4 h-4" /> },
        { id: 'buyers', label: 'Buyers', icon: <Users className="w-4 h-4" /> },
        { id: 'approvals', label: 'Approvals', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'dispatch', label: 'Dispatch', icon: <FileText className="w-4 h-4" /> },
        { id: 'map', label: 'Live Map', icon: <MapIcon className="w-4 h-4" /> },
        { id: 'system', label: 'System', icon: <Settings className="w-4 h-4" /> },
    ];

    return (
        <div className="flex h-[calc(100vh-80px)] font-sans bg-[#050505] text-gray-300 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-800/50 bg-[#0a0a0a] flex flex-col relative z-20">
                <div className="p-6 border-b border-gray-800/50 bg-black/50">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-blue-500" /> Command Center
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Admin Access Level 5</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${activeMenu === item.id
                                ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]'
                                : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                {item.label}
                            </div>
                            {item.id === 'approvals' && approvals.length > 0 && (
                                <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">{approvals.length}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800/50 bg-black/50">
                    <div className="bg-yellow-900/10 p-4 rounded-sm border border-yellow-900/20 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                        <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> System Alert
                        </p>
                        <p className="text-[9px] text-gray-400 leading-relaxed font-bold">
                            3 New Supplier verification requests pending audit in Kano region.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative">
                {/* Background FX */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                <header className="px-8 py-5 border-b border-gray-800/50 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-20">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        {activeMenu} Overview
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] border border-blue-500/20">LIVE</span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 border-r border-gray-800 pr-6">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Network Status</p>
                                <p className="text-xs font-bold text-green-400">Optimal (99.9%)</p>
                            </div>
                            <Activity className="w-5 h-5 text-green-500/50" />
                        </div>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search UUID or Name..."
                                className="bg-black/50 border border-gray-800 pl-10 pr-4 py-2 rounded-sm text-[10px] font-bold text-white focus:outline-none focus:border-blue-500 w-64 uppercase tracking-widest placeholder:text-gray-600 transition-colors"
                            />
                        </div>
                    </div>
                </header>

                <div className="p-8 relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-4 animate-pulse">Syncing Command Center...</p>
                        </div>
                    ) : (
                        <>
                            {activeMenu === 'suppliers' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Metrics */}
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm relative overflow-hidden group hover:border-blue-900/50 transition-colors">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><Truck className="w-16 h-16 text-blue-500" /></div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest relative z-10">Total Terminal Nodes</p>
                                            <p className="text-4xl font-black text-white mt-2 tracking-tighter relative z-10">{suppliers.length}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm relative overflow-hidden group hover:border-green-900/50 transition-colors">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><ShieldCheck className="w-16 h-16 text-green-500" /></div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest relative z-10">Verified / Active</p>
                                            <p className="text-4xl font-black text-green-400 mt-2 tracking-tighter relative z-10">{suppliers.filter(s => s.isVerified).length}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm relative overflow-hidden group hover:border-red-900/50 transition-colors">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><AlertTriangle className="w-16 h-16 text-red-500" /></div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest relative z-10">Pending Audit</p>
                                            <p className="text-4xl font-black text-red-400 mt-2 tracking-tighter relative z-10">{suppliers.filter(s => !s.isVerified).length}</p>
                                        </div>
                                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm relative overflow-hidden group hover:border-yellow-900/50 transition-colors">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><Database className="w-16 h-16 text-yellow-500" /></div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest relative z-10">Network Liquidity</p>
                                            <p className="text-3xl font-black text-yellow-500 mt-2 tracking-tighter relative z-10">{Math.floor(suppliers.reduce((acc, curr) => acc + curr.availableLiters, 0) / 1000)}k L</p>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-black/50 text-gray-400 border-b border-gray-800">
                                                <tr>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Supplier Entity</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Pricing & Stats</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Liquidity</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Status</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/50">
                                                {suppliers.map(supplier => (
                                                    <tr key={supplier.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-sm bg-blue-900/20 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-xs">
                                                                    {supplier.rating}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-black text-white uppercase">{supplier.name}</p>
                                                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{supplier.id} • {supplier.city}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-xs font-black text-blue-400 uppercase">{formatCurrency(supplier.pricePerLiter)}<span className="text-[9px] text-gray-500">/L</span></p>
                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">D: {supplier.density} • ETA: {supplier.etaMinutes}m</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="w-full bg-gray-900 rounded-full h-1.5 mb-1 max-w-[100px]">
                                                                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (supplier.availableLiters / 100000) * 100)}%` }}></div>
                                                            </div>
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{supplier.availableLiters.toLocaleString()}L</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${supplier.isVerified ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                {supplier.verificationStatus}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => toggleSupplierStatus(supplier.id, supplier.isVerified)}
                                                                className={`text-[9px] font-black uppercase tracking-widest border px-4 py-2 rounded-sm transition-all ${supplier.isVerified
                                                                    ? 'text-red-400 border-red-900/30 hover:bg-red-900/20 hover:border-red-500/50'
                                                                    : 'text-green-400 border-green-900/30 hover:bg-green-900/20 hover:border-green-500/50'
                                                                    }`}
                                                            >
                                                                {supplier.isVerified ? 'Revoke' : 'Authorize'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'buyers' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-black/50 text-gray-400 border-b border-gray-800">
                                                <tr>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Corporate Entity</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Credit Facility</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Volume/Score</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Status</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/50">
                                                {buyers.map(buyer => (
                                                    <tr key={buyer.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-4">
                                                            <p className="text-xs font-black text-white uppercase">{buyer.name}</p>
                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{buyer.id} • {buyer.city}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 max-w-[150px]">
                                                                <span>Utilized</span>
                                                                <span>{Math.round((buyer.utilizedCredit / buyer.creditLimit) * 100)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-900 rounded-full h-1.5 mb-1 max-w-[150px]">
                                                                <div className={`h-1.5 rounded-full ${buyer.utilizedCredit / buyer.creditLimit > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(buyer.utilizedCredit / buyer.creditLimit) * 100}%` }}></div>
                                                            </div>
                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{formatCurrency(buyer.utilizedCredit)} / {formatCurrency(buyer.creditLimit)}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-xs font-black text-gray-300 uppercase">{buyer.volume}</p>
                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                                Score: <span className={buyer.creditScore > 750 ? 'text-green-400' : 'text-yellow-400'}>{buyer.creditScore}</span>
                                                            </p>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${buyer.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                buyer.status === 'Warning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                                }`}>
                                                                {buyer.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => toggleBuyerStatus(buyer.id)}
                                                                className="text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-700 hover:text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-all"
                                                            >
                                                                {buyer.status === 'Active' ? 'Suspend' : 'Activate'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'approvals' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-gray-300">
                                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm overflow-hidden p-6 text-center">
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">Pending Corporate Verifications</h2>
                                        {approvals.length === 0 ? (
                                            <div className="py-20 opacity-50 flex flex-col items-center">
                                                <CheckCircle2 className="w-16 h-16 mb-4" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">System Clear: No Pending Audits</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {approvals.map(pending => (
                                                    <div key={pending.id} className="bg-black/40 border border-gray-800 p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-500/30 transition-all">
                                                        <div className="text-left flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border ${pending.role === 'supplier' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                                    {pending.role}
                                                                </div>
                                                                <p className="text-xs font-black text-white uppercase tracking-tight">{pending.business_name || pending.full_name}</p>
                                                            </div>
                                                            <div className="flex gap-6 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                                <span>Entity: {pending.email}</span>
                                                                <span>Region: {pending.city || 'Lagos'}</span>
                                                                <span>TIN: {pending.tin || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <button className="px-6 py-2 border border-gray-800 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-red-400 hover:border-red-900/30 transition-all">Decline Access</button>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const { error } = await supabase
                                                                            .from('profiles')
                                                                            .update({ is_approved: true })
                                                                            .eq('id', pending.id);

                                                                        if (error) throw error;

                                                                        // If it's a supplier, ensure verification_status is 'Verified'
                                                                        if (pending.role === 'supplier') {
                                                                            await supabase
                                                                                .from('suppliers')
                                                                                .update({ is_verified: true, verification_status: 'Verified' })
                                                                                .eq('profile_id', pending.id);
                                                                        }

                                                                        setApprovals(prev => prev.filter(p => p.id !== pending.id));
                                                                        alert('Entity Verified Successfully.');
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                        alert('Approval Failed.');
                                                                    }
                                                                }}
                                                                className="px-6 py-2 bg-blue-900 border border-blue-500/30 text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-800 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                                            >
                                                                Authorize Profile
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'dispatch' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-black/50 text-gray-400 border-b border-gray-800">
                                                <tr>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Tracking ID</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Logistics Details</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Financials</th>
                                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/50">
                                                {orders.map(order => (
                                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-4">
                                                            <p className="text-xs font-black text-white uppercase">{order.id}</p>
                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.timestamp).toLocaleTimeString()}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-xs font-bold text-gray-300 uppercase">{order.buyerName}</p>
                                                            <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">{order.liters.toLocaleString()}L • {order.distanceKm}KM DISTANCE</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="text-xs font-black text-white uppercase">{formatCurrency(order.totalCost)}</p>
                                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{order.paymentMethod}</p>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${order.status === 'Delivered' || order.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                    order.status === 'In Transit' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                                {order.status === 'In Transit' && (
                                                                    <button className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                                                                        <MapIcon className="w-3 h-3" /> Track
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeMenu === 'map' && (
                                <div className="bg-[#0a0a0a] border border-gray-800 rounded-sm h-[600px] flex items-center justify-center relative overflow-hidden group animate-in fade-in zoom-in-[0.98] duration-500">
                                    {/* Radar Scan Effect */}
                                    <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10"></div>
                                    <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10"></div>
                                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/20"></div>
                                    <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/30 bg-blue-500/5"></div>

                                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 border-l-2 border-green-500/50 origin-top rounded-tl-full bg-gradient-to-br from-green-500/10 to-transparent animate-[spin_4s_linear_infinite]"></div>

                                    {/* Mock Grid Background */}
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                                    <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-md border border-gray-800 p-4 rounded-sm text-center shadow-2xl z-10">
                                        <MapIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Grid Active</h3>
                                        <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest mt-1">{suppliers.length} Nodes Online</p>
                                    </div>

                                    {/* Mock Nodes */}
                                    {[
                                        { pos: 'top-1/4 left-1/4', id: 'TRK-204', status: 'In Transit', deg: 45 },
                                        { pos: 'top-1/3 right-1/4', id: 'TRK-109', status: 'Idle', deg: 120 },
                                        { pos: 'bottom-1/3 left-1/2', id: 'TRK-332', status: 'Loading', deg: 210 },
                                        { pos: 'top-1/2 left-1/3', id: 'TRK-881', status: 'In Transit', deg: 330 },
                                    ].map((node, i) => (
                                        <div key={i} className={`absolute ${node.pos} z-10`}>
                                            <div className="relative group cursor-pointer">
                                                <div className={`w-3 h-3 rounded-full relative z-10 border-2 border-[#0a0a0a] ${node.status === 'In Transit' ? 'bg-green-500' : node.status === 'Loading' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                                                {node.status === 'In Transit' && <div className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>}

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0a0a0a] border border-gray-800 p-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity w-48 shadow-2xl pointer-events-none">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest border-b border-gray-800 pb-2 mb-2">{node.id}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">Status <span className={node.status === 'In Transit' ? 'text-green-400' : 'text-yellow-400'}>{node.status}</span></p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex justify-between">Heading <span>{node.deg}°</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeMenu === 'system' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Settings */}
                                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                                                <Settings className="w-4 h-4 text-blue-500" /> Platform Configuration
                                            </h3>
                                            <div className="space-y-5">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase">Platform Trading Fee</p>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Base commission per transaction</p>
                                                    </div>
                                                    <span className="bg-blue-900/20 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-sm text-xs font-black">2.0%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase">Credit Surcharge</p>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">14-Day Facility Fee</p>
                                                    </div>
                                                    <span className="bg-blue-900/20 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-sm text-xs font-black">2.0%</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase">New Supplier Auto-Approve</p>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Bypass manual audit</p>
                                                    </div>
                                                    <div className="w-10 h-5 bg-gray-800 rounded-full relative cursor-pointer border border-gray-700">
                                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gray-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs font-black text-white uppercase">API Maintenance Mode</p>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Halt all trade executions</p>
                                                    </div>
                                                    <div className="w-10 h-5 bg-gray-800 rounded-full relative cursor-pointer border border-gray-700">
                                                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gray-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Logs */}
                                        <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-sm">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                                                <Terminal className="w-4 h-4 text-green-500" /> System Logs
                                            </h3>
                                            <div className="space-y-4 font-mono text-[10px]">
                                                {SYSTEM_LOGS.map(log => (
                                                    <div key={log.id} className="flex gap-4 p-2 hover:bg-white/5 rounded-sm transition-colors border-l-2 border-transparent hover:border-blue-500">
                                                        <span className="text-gray-500 whitespace-nowrap">[{log.time}]</span>
                                                        <span className={`w-16 whitespace-nowrap uppercase font-bold tracking-widest ${log.status === 'success' ? 'text-green-500' :
                                                            log.status === 'error' ? 'text-red-500' :
                                                                log.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                                                            }`}>
                                                            {log.type}
                                                        </span>
                                                        <span className="text-gray-300">{log.message}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-full mt-6 py-3 border border-gray-800 text-[9px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors rounded-sm">
                                                Export Log Archive
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
