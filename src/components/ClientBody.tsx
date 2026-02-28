'use client';

import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AppView, UserSession, City } from '@/types';
import { supabase } from '@/lib/supabase';

// Eagerly loaded (above the fold)
import LandingPage from './views/LandingPage';

// Lazy loaded — only fetched when user navigates to these views
const LoginPage = lazy(() => import('./views/LoginPage'));
const AuthPage = lazy(() => import('./views/AuthPage'));
const BuyerDashboard = lazy(() => import('./views/BuyerDashboard'));
const SupplierDashboard = lazy(() => import('./views/SupplierDashboard'));
const AdminDashboard = lazy(() => import('./views/AdminDashboard'));
const AdminGate = lazy(() => import('./AdminGate'));
const AboutUs = lazy(() => import('./views/AboutUs'));
const ContactUs = lazy(() => import('./views/ContactUs'));
const ProfilePage = lazy(() => import('./views/ProfilePage'));
const SuppliersList = lazy(() => import('./views/SuppliersList'));

// Reusable loading fallback
const ViewLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Loading Module...</p>
        </div>
    </div>
);

const ClientBody: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>('landing');
    const [selectedCity, setSelectedCity] = useState<City>('Lagos');
    const [session, setSession] = useState<UserSession | null>(null);
    const [showAdminGate, setShowAdminGate] = useState(false);

    // Sync Supabase Auth
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                const { data: { session: supabaseSession } } = await supabase.auth.getSession();
                if (mounted && supabaseSession?.user) {
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
            } catch (error: any) {
                // Silently handle abort errors or log others
                if (error.name !== 'AbortError') {
                    console.error('Auth Init Error:', error);
                }
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
            if (mounted) {
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
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleSetView = useCallback((view: AppView) => {
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
    }, [session]);

    const handleAdminUnlock = useCallback(() => {
        setShowAdminGate(false);
        setCurrentView('admin');
        if (!session) {
            setSession({
                id: 'admin',
                email: 'admin@system.ng',
                role: 'admin_ceo',
                name: 'System Administrator'
            });
        }
    }, [session]);

    const handleLogout = useCallback(async () => {
        await supabase.auth.signOut();
        setSession(null);
        setCurrentView('landing');
    }, []);

    const handleDemoLogin = useCallback((role: string = 'buyer') => {
        const mockSession: UserSession = {
            id: role === 'buyer' ? 'BUY-DEMO' : 'SUP-DEMO',
            email: role === 'buyer' ? 'buyadmin@clickserve.ng' : 'supadmin@clickserve.ng',
            role: role as any,
            name: role === 'buyer' ? 'Julius Berger PLC' : 'Oando Terminal A',
            city: 'Lagos'
        };
        setSession(mockSession);
        setCurrentView(role as any);
    }, []);

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

                <Suspense fallback={<ViewLoader />}>
                    {currentView === 'login' && (
                        <LoginPage
                            onSuccess={(role) => role ? handleDemoLogin(role) : handleSetView('landing')}
                            onSignUp={() => handleSetView('signup')}
                            onHome={() => handleSetView('landing')}
                        />
                    )}

                    {currentView === 'signup' && (
                        <AuthPage
                            onSuccess={() => handleSetView('login')}
                            onCancel={() => handleSetView('landing')}
                        />
                    )}

                    {currentView === 'buyer' && <BuyerDashboard city={selectedCity} />}
                    {currentView === 'supplier' && <SupplierDashboard />}
                    {currentView === 'admin' && <AdminDashboard />}
                    {currentView === 'about' && <AboutUs />}
                    {currentView === 'contact' && <ContactUs />}
                    {currentView === 'profile' && <ProfilePage />}
                    {currentView === 'marketplace' && <SuppliersList onLoginClick={() => handleSetView('login')} />}
                </Suspense>
            </main>

            {/* Admin Gate Modal */}
            <Suspense fallback={null}>
                {showAdminGate && (
                    <AdminGate
                        onUnlock={handleAdminUnlock}
                        onClose={() => setShowAdminGate(false)}
                    />
                )}
            </Suspense>

            {currentView !== 'login' && currentView !== 'signup' && currentView !== 'buyer' && currentView !== 'supplier' && currentView !== 'admin' && (
                <Footer setView={handleSetView} />
            )}
        </>
    );
};

export default ClientBody;
