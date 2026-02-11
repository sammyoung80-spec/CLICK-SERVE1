'use client';

import React from 'react';
import { TESTIMONIALS } from '@/lib/constants';
import { ShieldCheck, Target, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
    return (
        <div className="bg-white font-sans">
            {/* Hero */}
            <div className="relative h-[400px] flex items-center justify-center bg-blue-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900"></div>
                </div>

                <div className="relative z-10 text-center max-w-3xl px-4">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Powering The Industrial Base</h1>
                    <p className="text-xl text-blue-200 font-medium">SkyWhale Logistics is Nigeria's first fully digitized energy supply chain node.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-4">Our Mission</h2>
                        <h3 className="text-3xl font-black text-blue-900 uppercase tracking-tight mb-6">Eliminating Energy Friction</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            We built Click & Serve to solve the critical challenges of diesel procurement in Nigeria: lack of transparency, quality assurance issues, and logistical inefficiencies. By connecting verified terminal operators directly with corporate consumers, we create a friction-free marketplace.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-4xl font-black text-blue-900">50M+</h4>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Liters Delivered</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-black text-blue-900">12</h4>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Partner Terminals</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: <ShieldCheck className="w-8 h-8" />, title: "Zero Adulteration", desc: "Density tested at source." },
                            { icon: <Target className="w-8 h-8" />, title: "Precision Logistics", desc: "GPS tracked delivery." },
                            { icon: <Globe className="w-8 h-8" />, title: "Nationwide", desc: "Access to all major depots." },
                            { icon: <Award className="w-8 h-8" />, title: "Certified", desc: "DPR & ISO compliant." }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-sm border border-gray-100 hover:border-blue-900 transition-colors group">
                                <div className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h4 className="text-sm font-black text-blue-900 uppercase mb-2">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Marquee Testimonials */}
            <div className="bg-blue-900 py-16 overflow-hidden">
                <h2 className="text-center text-white text-xl font-black uppercase tracking-widest mb-12">Trusted By Industry Leaders</h2>
                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div key={i} className="w-[400px] bg-blue-800/50 p-6 rounded-sm border border-blue-700 flex-shrink-0 whitespace-normal">
                            <p className="text-blue-100 italic mb-4 text-sm">"{t.text}"</p>
                            <div>
                                <p className="text-xs font-black text-white uppercase">{t.name}</p>
                                <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">{t.company}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
