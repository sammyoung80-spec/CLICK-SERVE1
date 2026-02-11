'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminGate from './AdminGate';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import AuthPage from './views/AuthPage';
import { AppView, UserSession, City } from '@/types';
import { supabase } from '@/lib/supabase';

const ClientBody: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>('landing');
    const [selectedCity, setSelectedCity] = useState<City>('Lagos');
    const [session, setSession] = useState<UserSession | null>(null);
    const [showAdminGate, setShowAdminGate] = useState(false);

    // Sync Supabase Auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
            if (supabaseSession?.user) {
                // Map supabase user to our UserSession type based on metadata
                const role = supabaseSession.user.user_metadata.role || 'buyer';
                setSession({
                    id: supabaseSession.user.id,
                    email: supabaseSession.user.email || '',
                    role: role as any,
                    name: supabaseSession.user.user_metadata.business_name || 'User',
                    city: 'Lagos'
                });
                setCurrentView(role === 'supplier' ? 'supplier' : role === 'buyer' ? 'buyer' : 'landing');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
            if (supabaseSession?.user) {
                const role = supabaseSession.user.user_metadata.role || 'buyer';
                setSession({
                    id: supabaseSession.user.id,
                    email: supabaseSession.user.email || '',
                    role: role as any,
                    name: supabaseSession.user.user_metadata.business_name || 'User',
                    city: 'Lagos'
                });
            } else {
                setSession(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSetView = (view: AppView) => {
        if (view === 'admin') {
            if (session?.role && session.role.startsWith('admin')) {
                setCurrentView('admin');
            } else {
                setShowAdminGate(true);
            }
            return;
        }
        setCurrentView(view);
        window.scrollTo(0, 0);
    };

    const handleAdminUnlock = () => {
        setShowAdminGate(false);
        setCurrentView('admin');
        // In a real app, elevate session here
        if (!session) {
            setSession({
                id: 'admin',
                email: 'admin@system.ng',
                role: 'admin_ceo',
                name: 'System Administrator'
            });
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setCurrentView('landing');
    };

    const handleDemoLogin = (role: string = 'buyer') => {
        // Mock login for demo
        const mockSession: UserSession = {
            id: role === 'buyer' ? 'BUY-DEMO' : 'SUP-DEMO',
            email: role === 'buyer' ? 'buyadmin@clickserve.ng' : 'supadmin@clickserve.ng',
            role: role as any,
            name: role === 'buyer' ? 'Julius Berger PLC' : 'Oando Terminal A',
            city: 'Lagos'
        };
        setSession(mockSession);
        setCurrentView(role as any);
    };

    return (
        <>
            {currentView !== 'login' && currentView !== 'signup' && (
                <Navbar
                    currentView={currentView}
                    setView={handleSetView}
                    user={session}
                    onLogout={handleLogout}
                />
            )}

            <main className="flex-grow">
                {currentView === 'landing' && (
                    <LandingPage
                        onLogin={() => handleSetView('login')}
                        onGetStarted={() => handleSetView('signup')}
                        onOnboard={() => handleSetView('signup')}
                        selectedCity={selectedCity}
                        onCityChange={setSelectedCity}
                    />
                )}

                {currentView === 'login' && (
                    <LoginPage
                        onSuccess={(role) => role ? handleDemoLogin(role) : handleSetView('landing')} // In real auth, useEffect catches it
                        onSignUp={() => handleSetView('signup')}
                    />
                )}

                {currentView === 'signup' && (
                    <AuthPage
                        onSuccess={() => handleSetView('login')}
                        onCancel={() => handleSetView('landing')}
                    />
                )}

                {/* Placeholders for views not yet implemented fully in this turn */}
                {currentView === 'buyer' && <div className="p-20 text-center">Buyer Dashboard (Loading...)</div>}
                {currentView === 'supplier' && <div className="p-20 text-center">Supplier Dashboard (Loading...)</div>}
                {currentView === 'admin' && <div className="p-20 text-center">Admin Dashboard (Loading...)</div>}
                {currentView === 'about' && <div className="p-20 text-center">About Us (Loading...)</div>}
                {currentView === 'contact' && <div className="p-20 text-center">Contact Us (Loading...)</div>}
                {currentView === 'marketplace' && <div className="p-20 text-center">Marketplace (Loading...)</div>}
                {currentView === 'profile' && <div className="p-20 text-center">Profile (Loading...)</div>}
            </main>

            {/* Admin Gate Modal */}
            {showAdminGate && (
                <AdminGate
                    onUnlock={handleAdminUnlock}
                    onClose={() => setShowAdminGate(false)}
                />
            )}

            {currentView !== 'login' && currentView !== 'signup' && currentView !== 'buyer' && currentView !== 'supplier' && currentView !== 'admin' && (
                <Footer setView={handleSetView} />
            )}
        </>
    );
};

export default ClientBody;
