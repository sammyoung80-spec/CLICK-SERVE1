'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthPageProps {
    onSuccess: () => void;
    onCancel: () => void;
}

type AnimationState = 'truck-in' | 'man-pour' | 'liquid-dry' | 'form-reveal';

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onCancel }) => {
    const [animState, setAnimState] = useState<AnimationState>('truck-in');
    const [role, setRole] = useState<'buyer' | 'supplier' | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        businessName: '',
        phone: '',
        nin: '',
        tin: '',
        regNumber: ''
    });

    useEffect(() => {
        // Sequence the animation
        const truckTimer = setTimeout(() => setAnimState('man-pour'), 2000);
        const pourTimer = setTimeout(() => setAnimState('liquid-dry'), 4000);
        const revealTimer = setTimeout(() => setAnimState('form-reveal'), 6000);

        return () => {
            clearTimeout(truckTimer);
            clearTimeout(pourTimer);
            clearTimeout(revealTimer);
        };
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) { setError('Select a role'); return; }

        setLoading(true);
        // Simulate flow
        setTimeout(() => {
            alert("Registration Successful. Corporate Audit Initiated.");
            onSuccess();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-blue-900 z-[100] flex items-center justify-center font-sans overflow-hidden">

            {/* PHASE 1: TRUCK ANIMATION */}
            <AnimatePresence>
                {animState === 'truck-in' && (
                    <motion.div
                        initial={{ x: '-100%', rotate: -5 }}
                        animate={{ x: '0%', rotate: 0 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute z-10 flex flex-col items-center"
                    >
                        <div className="bg-yellow-400 p-8 rounded-lg shadow-2xl skew-x-[-10deg]">
                            <Truck className="w-32 h-32 text-blue-900" />
                        </div>
                        <div className="mt-4 bg-blue-950 px-4 py-2 text-yellow-400 font-black italic uppercase text-xs tracking-widest border-2 border-yellow-400 -skew-x-12">
                            SkyWhale Heavy Logistics
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 2: POURING */}
            <AnimatePresence>
                {animState === 'man-pour' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute z-20 flex flex-col items-center"
                    >
                        <Droplets className="w-32 h-32 text-yellow-400 animate-pulse" />
                        <div className="w-1 h-32 bg-yellow-400/50 mt-2 rounded-full blur-sm"></div>
                        <p className="mt-8 text-yellow-400 font-black uppercase tracking-widest text-xl animate-pulse">Initializing Protocol...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 3: LIQUID FILL */}
            <AnimatePresence>
                {animState === 'liquid-dry' && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: '-10%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-yellow-400 z-30 opacity-90"
                    ></motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 4: FORM */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: animState === 'form-reveal' ? 1 : 0, scale: animState === 'form-reveal' ? 1 : 0.9 }}
                className={`w-full max-w-4xl bg-white rounded-sm shadow-2xl relative z-40 border-t-8 border-yellow-400 m-4 max-h-[90vh] overflow-y-auto ${animState !== 'form-reveal' ? 'pointer-events-none' : ''}`}
            >
                <div className="grid md:grid-cols-5 min-h-[500px]">
                    {/* Sidebar */}
                    <div className="hidden md:block col-span-2 bg-blue-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596525997193-41bb2616f0ce?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Join The <br /><span className="text-yellow-400">Network</span></h2>
                                <p className="text-xs text-blue-200 font-medium leading-relaxed">Direct access to Nigeria's largest digital diesel inventory.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-yellow-400 text-xs font-black">1</div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide">Corporate Verification</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-yellow-400 text-xs font-black">2</div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide">Compliance Audit</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-yellow-400 text-xs font-black">3</div>
                                    <p className="text-[10px] font-bold uppercase tracking-wide">Trade Activation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="col-span-3 p-8 md:p-12">
                        {!role ? (
                            <div className="h-full flex flex-col justify-center text-center">
                                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight mb-8">Select Entity Type</h3>
                                <div className="grid gap-6">
                                    <button onClick={() => setRole('buyer')} className="p-6 border-2 border-gray-100 hover:border-blue-900 hover:bg-blue-50 transition-all rounded-sm group">
                                        <h4 className="text-lg font-black text-blue-900 uppercase tracking-widest mb-2 group-hover:translate-x-2 transition-transform">Buyer Enrollment</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Procurement for Corporate Fleets</p>
                                    </button>
                                    <button onClick={() => setRole('supplier')} className="p-6 border-2 border-gray-100 hover:border-blue-900 hover:bg-blue-50 transition-all rounded-sm group">
                                        <h4 className="text-lg font-black text-blue-900 uppercase tracking-widest mb-2 group-hover:translate-x-2 transition-transform">Supplier Enrollment</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Terminal & Depot Operations</p>
                                    </button>
                                </div>
                                <button onClick={onCancel} className="mt-8 text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-600">Cancel</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSignUp} className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight">New {role} Profile</h3>
                                    <button type="button" onClick={() => setRole(null)} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-900">Change</button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Corporate Email</label>
                                        <input required type="email" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm font-bold text-xs text-blue-900 focus:border-blue-900 outline-none" placeholder="admin@company.ng" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Registered Business Name</label>
                                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm font-bold text-xs text-blue-900 focus:border-blue-900 outline-none" placeholder="RC Entity Name" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">RC Number</label>
                                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm font-bold text-xs text-blue-900 focus:border-blue-900 outline-none" placeholder="RC-000000" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tax ID (TIN)</label>
                                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm font-bold text-xs text-blue-900 focus:border-blue-900 outline-none" placeholder="TIN-0000" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Directors NIN</label>
                                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm font-bold text-xs text-blue-900 focus:border-blue-900 outline-none" placeholder="11-Digit NIN" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Password</label>
                                        <input required type="password" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-sm font-bold text-xs text-blue-900 focus:border-blue-900 outline-none" placeholder="Min 8 characters" />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button onClick={onCancel} type="button" className="flex-1 py-4 border-2 border-red-100 text-red-400 font-black uppercase tracking-widest text-xs rounded-sm hover:bg-red-50">Cancel</button>
                                    <button disabled={loading} className="flex-[2] py-4 bg-blue-900 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-black shadow-lg">
                                        {loading ? 'Submitting...' : 'Submit for Audit'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
