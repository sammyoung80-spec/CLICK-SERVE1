'use client';

import React, { useState } from 'react';
import { City, CityData } from '@/types';
import { CITY_METRICS, TESTIMONIALS } from '@/lib/constants';
import { calculateBuyerTotal, formatCurrency } from '@/utils/pricing';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Droplets, ShieldCheck, Truck, BarChart3 } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onGetStarted: () => void;
    onOnboard: () => void;
    selectedCity: City;
    onCityChange: (city: City) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
    onLogin,
    onGetStarted,
    onOnboard,
    selectedCity,
    onCityChange
}) => {
    const [liters, setLiters] = useState(10000);

    const metrics = CITY_METRICS[selectedCity];
    const savingsPreview = calculateBuyerTotal(metrics.price, liters, 10);

    return (
        <div className="font-sans">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src="/hero-bg.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40 mix-blend-multiply"></div>
                </div>

                <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 px-3 py-1 rounded-sm font-black text-[10px] uppercase tracking-widest mb-2">
                            <span className="w-2 h-2 rounded-full bg-blue-900 animate-pulse"></span>
                            Live Supply Node
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                            Industrial <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Diesel</span> <br />
                            Logistics
                        </h1>

                        <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl leading-relaxed border-l-4 border-yellow-400 pl-6">
                            The first digital marketplace connecting corporate buyers directly to verified terminals in {metrics.name} with trade finance integration.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={onOnboard}
                                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 text-sm flex items-center gap-2"
                            >
                                Onboard Company <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onLogin}
                                className="border-2 border-white text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-white hover:text-blue-900 transition-all active:scale-95 text-sm"
                            >
                                Terminal Login
                            </button>
                        </div>
                    </motion.div>

                    {/* Calculator Utility */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/95 backdrop-blur-md p-8 rounded-sm shadow-2xl border-t-8 border-yellow-400"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <h3 className="text-blue-900 font-black uppercase tracking-widest text-sm">Real-Time Quote</h3>
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                <MapPin className="w-4 h-4 text-blue-900" />
                                <select
                                    value={selectedCity}
                                    onChange={(e) => onCityChange(e.target.value as City)}
                                    className="bg-transparent text-blue-900 font-bold text-xs uppercase outline-none cursor-pointer"
                                >
                                    {Object.keys(CITY_METRICS).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Volume (Liters)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={liters}
                                        onChange={(e) => setLiters(Number(e.target.value))}
                                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-sm font-black text-blue-900 text-xl focus:border-blue-900 focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">LITERS</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-sm">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Market Rate</p>
                                    <p className="text-lg font-black text-blue-900">{formatCurrency(metrics.price)}<span className="text-[10px] text-gray-400">/L</span></p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-sm">
                                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">Availability</p>
                                    <p className="text-lg font-black text-green-700">{metrics.supply} VOL</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed border-gray-200">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Estimated Total</p>
                                    <p className="text-3xl font-black text-blue-900 tracking-tight">{formatCurrency(savingsPreview.total)}</p>
                                </div>
                                <p className="text-[9px] text-right text-gray-400 mt-1 font-medium">*Includes logistics & platform fees</p>
                            </div>

                            <button
                                onClick={onGetStarted}
                                className="w-full bg-blue-900 text-white py-4 rounded-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-95 text-xs"
                            >
                                Secure This Rate
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
                >
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black">Scroll</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </section>

            {/* Stats Ticker */}
            <div className="bg-blue-900 border-t border-blue-800 overflow-hidden py-4">
                <div className="animate-marquee whitespace-nowrap flex gap-12 text-blue-200 text-xs font-bold uppercase tracking-widest">
                    <span>• Live Terminal Density: 0.845 g/cm³</span>
                    <span>• Active Fleets: 142 Trucks</span>
                    <span>• Price Trend: Stable</span>
                    <span>• Weather Alert: Clear for Dispatch</span>
                    <span>• Live Terminal Density: 0.845 g/cm³</span>
                    <span>• Active Fleets: 142 Trucks</span>
                    <span>• Price Trend: Stable</span>
                    <span>• Weather Alert: Clear for Dispatch</span>
                </div>
            </div>

            {/* Value Props */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <ShieldCheck className="w-10 h-10" />, title: "Verified Quality", desc: "Every drop is density-tested at terminal exit. Zero tolerance for adulteration." },
                            { icon: <Truck className="w-10 h-10" />, title: "Live Logistics", desc: "Track your dispatch in real-time from depot to delivery point." },
                            { icon: <BarChart3 className="w-10 h-10" />, title: "Trade Finance", desc: "buy now, pay later options for verified huge corporate buyers." }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 border border-gray-100 hover:border-blue-900 hover:shadow-2xl transition-all duration-300 rounded-sm">
                                <div className="text-yellow-500 mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter mb-4">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-slate-50 border-y border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-4">Operations Protocol</h2>
                    <h2 className="text-4xl md:text-5xl font-black text-blue-900 uppercase tracking-tighter mb-16">Digitized Supply Chain</h2>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                        {[
                            { step: "01", title: "Select City", desc: "Choose your operations hub" },
                            { step: "02", title: "Compare Rates", desc: "View live terminal prices" },
                            { step: "03", title: "Secure Order", desc: "Lock price & dispatch fleet" },
                            { step: "04", title: "Track & Pay", desc: "Monitor delivery & settle" }
                        ].map((s, i) => (
                            <div key={i} className="bg-slate-50">
                                <div className="w-24 h-24 bg-white border-4 border-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                                    <span className="text-2xl font-black text-blue-900">{s.step}</span>
                                </div>
                                <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-2">{s.title}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-blue-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-16">Industrial Trust</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="bg-blue-800/50 p-8 rounded-sm backdrop-blur-sm border border-blue-700 hover:bg-blue-800 transition-colors">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-2 h-2 bg-yellow-400 rounded-full"></div>)}
                                </div>
                                <p className="text-blue-100 font-medium italic mb-6 leading-relaxed">"{t.text}"</p>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-white">{t.name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500">{t.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-yellow-400 text-blue-900 text-center px-4">
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 max-w-4xl mx-auto leading-[0.9]">Ready to Optimize Fuel Logistics?</h2>
                <button
                    onClick={onOnboard}
                    className="bg-blue-900 text-white px-12 py-6 rounded-sm font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform"
                >
                    Start Your Onboarding
                </button>
            </section>
        </div>
    );
};

// Helper for scroll icon
function ChevronDown({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default LandingPage;
