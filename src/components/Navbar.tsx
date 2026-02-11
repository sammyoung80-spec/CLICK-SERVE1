'use client';

import React, { useState } from 'react';
import { AppView, UserSession } from '../types';
import { supabase } from '../lib/supabase';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Home, Phone, Info, ShoppingCart } from 'lucide-react';

interface NavbarProps {
    currentView: AppView;
    setView: (view: AppView) => void;
    user: UserSession | null;
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const navLinks = [
        { name: 'Home', view: 'landing' as AppView, icon: <Home className="w-4 h-4" /> },
        { name: 'About', view: 'about' as AppView, icon: <Info className="w-4 h-4" /> },
        { name: 'Contact', view: 'contact' as AppView, icon: <Phone className="w-4 h-4" /> },
        { name: 'Marketplace', view: 'marketplace' as AppView, icon: <ShoppingCart className="w-4 h-4" /> },
    ];

    const handleNavClick = (view: AppView) => {
        setView(view);
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo container */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('landing')}>
                        <img
                            src="/logo.jpeg"
                            alt="SkyWhale Click & Serve"
                            className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                        <div className="ml-3 hidden lg:block">
                            <h1 className="text-xl font-black text-blue-900 leading-none tracking-tighter">CLICK & SERVE</h1>
                            <p className="text-[10px] uppercase font-bold text-yellow-500 tracking-[0.3em]">Diesel Supply Node</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link.view)}
                                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${currentView === link.view ? 'text-blue-900 border-b-2 border-yellow-400 pb-1' : 'text-gray-400 hover:text-blue-900'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </button>
                        ))}

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-black text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="text-left hidden lg:block">
                                        <p className="text-[10px] font-black text-blue-900 uppercase leading-none">{user.name}</p>
                                        <p className="text-[8px] font-bold text-gray-500 uppercase leading-none mt-1">{user.role.replace('_', ' ')}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-sm shadow-xl border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50 block lg:hidden">
                                            <p className="text-sm font-black text-blue-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <button
                                            onClick={() => handleNavClick(user.role as AppView)}
                                            className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-900 flex items-center gap-2 uppercase tracking-wide"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </button>

                                        <button
                                            onClick={() => handleNavClick('profile')}
                                            className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-900 flex items-center gap-2 uppercase tracking-wide"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile Settings
                                        </button>

                                        <div className="border-t border-gray-50 my-1"></div>

                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 uppercase tracking-wide"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleNavClick('login')}
                                    className="text-xs font-black text-blue-900 uppercase tracking-widest hover:text-yellow-500 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavClick('signup')}
                                    className="bg-blue-900 text-white px-6 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all hover:shadow-lg active:scale-95"
                                >
                                    Join Network
                                </button>
                            </div>
                        )}

                        {/* Admin Link (Hidden/Subtle) */}
                        <button
                            onClick={() => handleNavClick('admin')}
                            className={`text-[8px] uppercase tracking-widest font-black ${currentView === 'admin' ? 'text-red-500' : 'text-gray-200 hover:text-gray-400'}`}
                        >
                            Admin
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-blue-900 hover:text-yellow-500 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-5">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link.view)}
                                className={`flex w-full items-center gap-3 px-3 py-4 text-xs font-black uppercase tracking-widest rounded-sm ${currentView === link.view ? 'bg-blue-50 text-blue-900 border-l-4 border-blue-900' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-900'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </button>
                        ))}

                        <div className="border-t border-gray-100 my-4 pt-4">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="px-3 flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-blue-900 uppercase">{user.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase">{user.role.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleNavClick(user.role as AppView)} className="w-full text-left px-3 py-3 text-xs font-bold text-blue-900 bg-blue-50 rounded-sm uppercase tracking-widest">Dashboard</button>
                                    <button onClick={onLogout} className="w-full text-left px-3 py-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-sm uppercase tracking-widest">Sign Out</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleNavClick('login')} className="w-full py-4 text-xs font-black text-blue-900 border border-blue-900 rounded-sm uppercase tracking-widest text-center">Login</button>
                                    <button onClick={() => handleNavClick('signup')} className="w-full py-4 text-xs font-black text-white bg-blue-900 rounded-sm uppercase tracking-widest text-center">Sign Up</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
