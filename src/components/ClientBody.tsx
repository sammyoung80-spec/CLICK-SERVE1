'use client';

import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AppView, UserSession, City } from '@/types';
import { supabase } from '@/lib/supabase';
import { Shield, Clock, LogOut } from 'lucide-react';

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

                    // Fetch profile to check approval status
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('is_approved')
                        .eq('id', supabaseSession.user.id)
                        .single();

                    setSession({
                        id: supabaseSession.user.id,
                        email: supabaseSession.user.email || '',
                        role: role as any,
                        name: supabaseSession.user.user_metadata.business_name || 'User',
                        city: 'Lagos',
                        isApproved: profile?.is_approved ?? false
                    });

                    if (profile?.is_approved) {
                        setCurrentView(role === 'supplier' ? 'supplier' : role === 'buyer' ? 'buyer' : 'landing');
                    }
                }
            } catch (error: any) {
                // Silently handle abort errors or log others
                if (error.name !== 'AbortError') {
                    console.error('Auth Init Error:', error);
                }
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, supabaseSession) => {
            if (mounted) {
                if (supabaseSession?.user) {
                    const role = supabaseSession.user.user_metadata.role || 'buyer';

                    // Fetch profile to check approval status
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('is_approved')
                        .eq('id', supabaseSession.user.id)
                        .single();

                    setSession({
                        id: supabaseSession.user.id,
                        email: supabaseSession.user.email || '',
                        role: role as any,
                        name: supabaseSession.user.user_metadata.business_name || 'User',
                        city: 'Lagos',
                        isApproved: profile?.is_approved ?? false
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
            city: 'Lagos',
            isApproved: true
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

                    {/* Approval Gate View */}
                    {session && !session.isApproved && !session.role?.startsWith('admin') && (
                        <div className="fixed inset-0 bg-[#050505] z-[150] flex items-center justify-center p-4">
                            <div className="max-w-md w-full bg-[#0a0a0a] border border-gray-800 p-10 rounded-sm text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20">
                                    <Shield className="w-10 h-10 text-yellow-500" />
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Verification Pending</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                                    Your corporate profile is currently under audit by our compliance team. ACCESS to the trading terminal is RESTRICTED until verification is complete.
                                </p>
                                <div className="flex items-center justify-center gap-2 mb-10 text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/5 py-3 border border-yellow-500/10">
                                    <Clock className="w-4 h-4" /> Estimated Time: 2-4 Hours
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-4 bg-white/5 border border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Exit Terminal
                                </button>
                            </div>
                        </div>
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
