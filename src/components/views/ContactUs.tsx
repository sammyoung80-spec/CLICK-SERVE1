'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter mb-4">Contact Support</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Our logistics command center is available 24/7. Reach out for bulk inquiries, terminal partnerships, or technical support.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-yellow-400">
                            <Phone className="w-8 h-8 text-blue-900 mb-4" />
                            <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-2">Call Center</h3>
                            <p className="text-gray-500 text-sm mb-4">24/7 Dispatch Support</p>
                            <a href="tel:+234800SKYWHALE" className="text-lg font-black text-blue-900 hover:text-yellow-500 transition-colors">+234 800 SKYWHALE</a>
                        </div>

                        <div className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-yellow-400">
                            <Mail className="w-8 h-8 text-blue-900 mb-4" />
                            <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-2">Email Support</h3>
                            <p className="text-gray-500 text-sm mb-4">Corporate & Fleet Inquiries</p>
                            <a href="mailto:support@clickserve.ng" className="text-lg font-black text-blue-900 hover:text-yellow-500 transition-colors">support@clickserve.ng</a>
                        </div>

                        <div className="bg-white p-8 rounded-sm shadow-sm border-l-4 border-yellow-400">
                            <MapPin className="w-8 h-8 text-blue-900 mb-4" />
                            <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-2">Headquarters</h3>
                            <p className="text-gray-500 text-sm">
                                SkyWhale Logistics Hub,<br />
                                14 Wharf Road, Apapa,<br />
                                Lagos, Nigeria.
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-sm shadow-xl border-t-8 border-blue-900">
                            <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight mb-8">Send an Inquiry</h3>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">First Name</label>
                                    <input required type="text" className="w-full bg-slate-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-blue-900 font-bold text-sm text-blue-900" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Last Name</label>
                                    <input required type="text" className="w-full bg-slate-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-blue-900 font-bold text-sm text-blue-900" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Corporate Email</label>
                                <input required type="email" className="w-full bg-slate-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-blue-900 font-bold text-sm text-blue-900" />
                            </div>

                            <div className="mb-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Message</label>
                                <textarea required rows={5} className="w-full bg-slate-50 border border-gray-200 p-4 rounded-sm outline-none focus:border-blue-900 font-bold text-sm text-blue-900"></textarea>
                            </div>

                            <button className="w-full bg-blue-900 text-white py-4 rounded-sm font-black uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                {submitted ? 'Message Sent' : 'Disptach Message'}
                            </button>

                            {submitted && (
                                <div className="mt-4 p-4 bg-green-50 text-green-700 font-bold text-center text-xs uppercase tracking-wide">
                                    Your inquiry has been logged. Automated ticket #9921 created.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
