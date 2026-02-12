'use client';

import React from 'react';
import { AppView } from '../types';

interface FooterProps {
    setView: (view: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
    return (
        <footer className="bg-blue-900 text-white pt-20 pb-10 border-t-8 border-yellow-400 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto bg-white p-1 rounded-sm" />
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Click & Serve</h2>
                                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-[0.3em]">Industrial Logistics Node</p>
                            </div>
                        </div>
                        <p className="text-blue-200 text-xs leading-relaxed max-w-sm font-medium mb-8">
                            Reliable AGO delivery for industrial operations. We bridge the gap between verified depots and corporate consumers with transparent pricing and trade finance.
                        </p>
                        <div className="flex gap-4">
                            {['ln', 'tw', 'fb', 'ig'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 bg-blue-800 flex items-center justify-center rounded-sm hover:bg-yellow-400 hover:text-blue-900 transition-all">
                                    <span className="font-black text-[10px] uppercase">{social}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-6">Platform</h3>
                        <ul className="space-y-4">
                            <li><button onClick={() => setView('marketplace')} className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Marketplace</button></li>
                            <li><button onClick={() => setView('login')} className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Supplier Portal</button></li>
                            <li><button onClick={() => setView('login')} className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Corporate Login</button></li>
                            <li><button onClick={() => setView('about')} className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">About Us</button></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><button onClick={() => setView('contact')} className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Help Center</button></li>
                            <li><a href="#" className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Compliance Docs</a></li>
                            <li><a href="#" className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Privacy Policy</a></li>
                            <li><a href="#" className="text-xs font-bold text-blue-200 hover:text-white uppercase tracking-wide">Terms of Trade</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} SkyWhale Click&Serve Logistics Ltd. RC-7254292.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.didsystemsinc.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Designed by DIDS' SYSTEMS INC
                        </a>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            System Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
