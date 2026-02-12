'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, Lock, User, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPageProps {
    onSuccess: (role?: string) => void;
    onSignUp: () => void;
    onHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onSignUp, onHome }) => {
    const [activeRole, setActiveRole] = useState<'supplier' | 'buyer'>('buyer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo Bypass
        if (activeRole === 'supplier' && email === 'supadmin' && password === 'Sup123') {
            setTimeout(() => onSuccess('supplier'), 800);
            return;
        }

        if (activeRole === 'buyer' && email === 'buyadmin' && password === 'Buy123') {
            setTimeout(() => onSuccess('buyer'), 800);
            return;
        }

        // Admin Access (Password only)
        if (password === "Didsown'sit26$") {
            setTimeout(() => onSuccess('admin'), 800);
            return;
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            onSuccess();
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-blue-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596525997193-41bb2616f0ce?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-900/90"></div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-lg rounded-sm shadow-2xl relative z-10 overflow-hidden border-t-8 border-yellow-400"
            >
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveRole('buyer')}
                        className={`flex-1 py-6 flex flex-col items-center gap-2 transition-colors ${activeRole === 'buyer' ? 'bg-white text-blue-900' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Buyer Portal</span>
                    </button>
                    <button
                        onClick={() => setActiveRole('supplier')}
                        className={`flex-1 py-6 flex flex-col items-center gap-2 transition-colors ${activeRole === 'supplier' ? 'bg-white text-blue-900' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        <Truck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Supplier Node</span>
                    </button>
                </div>

                <div className="p-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter mb-2">
                            {activeRole === 'buyer' ? 'Procurement Access' : 'Terminal Command'}
                        </h2>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Secure Logistics Gateway
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Corporate ID</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={activeRole === 'buyer' ? 'buyadmin' : 'supadmin'}
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm text-sm font-bold text-blue-900 focus:border-blue-900 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-sm text-sm font-bold text-blue-900 focus:border-blue-900 focus:outline-none transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 text-[10px] font-bold uppercase tracking-wide border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full bg-blue-900 text-white py-4 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all text-xs shadow-lg"
                        >
                            {loading ? 'Authenticating...' : 'Enter System'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="bg-yellow-50 p-4 border border-yellow-100 rounded-sm mb-6">
                            <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-widest text-center">
                                Demo: {activeRole === 'supplier' ? 'supadmin / Sup123' : 'buyadmin / Buy123'} | Admin: admin / Didsown'sit26$
                            </p>
                        </div>

                        <div className="text-center flex flex-col gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">New Entity?</p>
                                <button onClick={onSignUp} className="text-blue-900 text-xs font-black uppercase tracking-widest hover:text-yellow-600">
                                    Register for Access
                                </button>
                            </div>
                            <button onClick={onHome} className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors">
                                ← Back to Homepage
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
