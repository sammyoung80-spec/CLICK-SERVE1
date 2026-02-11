'use client';

import React, { useState } from 'react';
import { MOCK_SUPPLIERS, MOCK_BUYERS, MOCK_ORDERS, CITY_METRICS } from '@/lib/constants';
import { Supplier } from '@/types';
import { ShieldCheck, Users, Truck, AlertTriangle, FileText, LayoutGrid, Map as MapIcon, Settings, Search, MoreVertical, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState('suppliers');
    const [suppliers, setSuppliers] = useState(MOCK_SUPPLIERS);

    const toggleStatus = (id: string) => {
        setSuppliers(prev => prev.map(s => {
            if (s.id === id) {
                return {
                    ...s,
                    isVerified: !s.isVerified,
                    verificationStatus: !s.isVerified ? 'Verified' : 'Pending'
                };
            }
            return s;
        }));
    };

    const menuItems = [
        { id: 'suppliers', label: 'Suppliers', icon: <Truck className="w-4 h-4" /> },
        { id: 'buyers', label: 'Buyers', icon: <Users className="w-4 h-4" /> },
        { id: 'orders', label: 'Dispatch', icon: <FileText className="w-4 h-4" /> },
        { id: 'map', label: 'Live Map', icon: <MapIcon className="w-4 h-4" /> },
        { id: 'settings', label: 'System', icon: <Settings className="w-4 h-4" /> },
    ];

    return (
        <div className="flex h-[calc(100vh-80px)] font-sans bg-[#0b1120] text-gray-300">
            {/* Sidebar */}
            <div className="w-64 border-r border-blue-900/50 bg-[#0b1120] flex flex-col">
                <div className="p-6 border-b border-blue-900/50">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-red-500" /> Command Center
                    </h2>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Admin Access Level 5</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest transition-all ${activeMenu === item.id ? 'bg-blue-900/30 text-white border-l-2 border-red-500' : 'hover:bg-blue-900/10 hover:text-white'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-blue-900/50">
                    <div className="bg-red-900/10 p-4 rounded-sm border border-red-900/20">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> System Alert
                        </p>
                        <p className="text-[9px] leading-relaxed">
                            3 New Suppler verification requests pending audit in Kano region.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-[url('/grid-bg.png')]">
                <header className="px-8 py-6 border-b border-blue-900/50 flex justify-between items-center bg-[#0b1120]/95 backdrop-blur-sm sticky top-0 z-20">
                    <h1 className="text-xl font-black text-white uppercase tracking-tighter">{activeMenu} Overview</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="text" placeholder="Search Node..." className="bg-black/20 border border-blue-900/50 pl-10 pr-4 py-2 rounded-sm text-xs font-bold focus:outline-none focus:border-blue-500 w-64 uppercase placeholder:text-gray-600" />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {activeMenu === 'suppliers' && (
                        <div className="space-y-6">
                            {/* Metrics */}
                            <div className="grid grid-cols-4 gap-6">
                                <div className="bg-blue-900/10 border border-blue-900/30 p-6 rounded-sm">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Total Nodes</p>
                                    <p className="text-3xl font-black text-white mt-2">{suppliers.length}</p>
                                </div>
                                <div className="bg-green-900/10 border border-green-900/30 p-6 rounded-sm">
                                    <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">Verified</p>
                                    <p className="text-3xl font-black text-white mt-2">{suppliers.filter(s => s.isVerified).length}</p>
                                </div>
                                <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-sm">
                                    <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Pending Audit</p>
                                    <p className="text-3xl font-black text-white mt-2">{suppliers.filter(s => !s.isVerified).length}</p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-black/20 border border-blue-900/30 rounded-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-blue-900/20 text-blue-200">
                                        <tr>
                                            <th className="p-4 text-[9px] font-black uppercase tracking-widest">Supplier Entity</th>
                                            <th className="p-4 text-[9px] font-black uppercase tracking-widest">Region</th>
                                            <th className="p-4 text-[9px] font-black uppercase tracking-widest">Terminal Price</th>
                                            <th className="p-4 text-[9px] font-black uppercase tracking-widest">Status</th>
                                            <th className="p-4 text-[9px] font-black uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-900/10">
                                        {suppliers.map(supplier => (
                                            <tr key={supplier.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <p className="text-xs font-black text-white uppercase">{supplier.name}</p>
                                                    <p className="text-[9px] font-bold text-gray-500 uppercase">{supplier.id}</p>
                                                </td>
                                                <td className="p-4 text-xs font-bold uppercase">{supplier.city}</td>
                                                <td className="p-4 text-xs font-bold text-white uppercase">{supplier.pricePerLiter} NGN</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-xs text-[8px] font-black uppercase tracking-widest ${supplier.isVerified ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                                        {supplier.verificationStatus}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => toggleStatus(supplier.id)}
                                                        className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white border border-blue-900/30 px-3 py-2 rounded-sm hover:bg-blue-900/30 transition-all"
                                                    >
                                                        {supplier.isVerified ? 'Revoke Access' : 'Authorize Node'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'map' && (
                        <div className="bg-black/40 border border-blue-900/30 rounded-sm h-[600px] flex items-center justify-center relative overflow-hidden group">
                            {/* Mock Map Background */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
                                    {[...Array(144)].map((_, i) => (
                                        <div key={i} className="border border-blue-500/10"></div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                <MapIcon className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Live Satellite Feed</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Connecting to Logistics Grid...</p>
                            </div>

                            {/* Mock Nodes */}
                            {['top-1/4 left-1/4', 'top-1/2 right-1/4', 'bottom-1/3 left-1/2'].map((pos, i) => (
                                <div key={i} className={`absolute ${pos}`}>
                                    <div className="relative">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping absolute top-0 left-0"></div>
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full relative z-10"></div>
                                        <div className="absolute top-4 left-4 bg-black/80 text-yellow-500 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-sm whitespace-nowrap border border-yellow-500/20">
                                            Truck #{200 + i} Active
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {(activeMenu !== 'suppliers' && activeMenu !== 'map') && (
                        <div className="flex flex-col items-center justify-center h-[400px] border border-dashed border-gray-700 rounded-sm">
                            <Settings className="w-10 h-10 text-gray-700 mb-4" />
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Module Under Maintenance</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
