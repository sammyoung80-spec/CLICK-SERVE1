'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldAlert, X } from 'lucide-react';

interface AdminGateProps {
    onUnlock: () => void;
    onClose: () => void;
}

const AdminGate: React.FC<AdminGateProps> = ({ onUnlock, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "Didsown'sit26$") {
            onUnlock();
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0b1120] border border-blue-800 p-10 rounded-sm shadow-2xl max-w-md w-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Restricted Access</h2>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mt-2">Level 5 Security Clearance Required</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            autoFocus
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-blue-800 text-white p-4 text-center text-xl tracking-[0.5em] font-black focus:outline-none focus:border-red-500 transition-colors uppercase placeholder:tracking-normal placeholder:text-xs placeholder:font-bold"
                            placeholder="Enter Access Key"
                        />
                        {error && (
                            <motion.div
                                initial={{ x: -10 }}
                                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                                className="absolute -bottom-6 left-0 w-full text-center text-[9px] font-black text-red-500 uppercase tracking-widest mt-2"
                            >
                                Access Denied: Invalid Key
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)]"
                    >
                        Authenticate
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 opacity-50">
                    <ShieldAlert className="w-4 h-4 text-gray-400" />
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">System Logs All Attempts</p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminGate;
