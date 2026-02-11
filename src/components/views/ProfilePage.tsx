'use client';

import React from 'react';
import { User, Building, MapPin, Mail, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen font-sans py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter mb-8">Entity Settings</h1>

                <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-blue-900 p-8 text-white flex items-center gap-6">
                        <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 text-3xl font-black">
                            U
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">User Account</h2>
                            <p className="text-xs text-blue-200 font-bold uppercase tracking-widest">Authorized Personnel</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Corporate Name</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-sm">
                                    <Building className="w-4 h-4 text-blue-900" />
                                    <input type="text" value="Julius Berger PLC" readOnly className="bg-transparent font-bold text-sm text-blue-900 outline-none w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Contact Email</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-sm">
                                    <Mail className="w-4 h-4 text-blue-900" />
                                    <input type="email" value="procurement@jb.ng" readOnly className="bg-transparent font-bold text-sm text-blue-900 outline-none w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Default Operations Hub</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-sm">
                                    <MapPin className="w-4 h-4 text-blue-900" />
                                    <select className="bg-transparent font-bold text-sm text-blue-900 outline-none w-full">
                                        <option>Lagos</option>
                                        <option>Abuja</option>
                                        <option>Port Harcourt</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Representative Name</label>
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-4 rounded-sm">
                                    <User className="w-4 h-4 text-blue-900" />
                                    <input type="text" value="Adewale Johnson" className="bg-transparent font-bold text-sm text-blue-900 outline-none w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <button className="bg-blue-900 text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-black transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
