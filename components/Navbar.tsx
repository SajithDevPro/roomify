import React, { useState, useEffect } from 'react';
import { Box, Menu, X, ChevronDown, Sparkles, LogIn, LogOut, User, Home, Image, Settings } from "lucide-react";
import Button from "./UI/Button";
import { useOutletContext } from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error("Puter Sign Out Failed.", e);
            }
            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error("Puter Sign In Failed", e);
        }
    };

    const navLinks = [
        { name: 'Product', href: '/', icon: Home },
        { name: 'Pricing', href: '/pricing', icon: Image },
        { name: 'Community', href: '/community', icon: User },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 shadow-glass'
                : 'py-5 bg-transparent'
            }`}
        >
            {/* Dynamic Mouse Gradient Effect */}
            <div
                className="absolute inset-0 pointer-events-none opacity-0 lg:opacity-100 transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
                }}
            />

            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between">
                    {/* Left Section - Logo and Links */}
                    <div className="flex items-center gap-8 lg:gap-12">
                        {/* Logo/Brand */}
                        <a
                            href="/home"
                            className="relative group flex items-center gap-2"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:scale-110 transition-all duration-300">
                                    <Box className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    Build
                                </span>
                                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Xo
                                </span>
                            </span>
                        </a>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="relative group px-4 py-2 rounded-xl text-white/60 hover:text-white transition-all duration-300"
                                >
                                    <span className="relative z-10 text-sm font-medium">{link.name}</span>
                                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-1/2 transition-all duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-3">
                        {isSignedIn ? (
                            /* Signed In State */
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-white/80 group-hover:text-white">
                                        {userName || 'User'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0a0a0a] border border-white/10 rounded-xl backdrop-blur-xl shadow-premium animate-fade-in">
                                        <div className="h-px bg-white/10 my-2" />
                                        <button
                                            onClick={handleAuthClick}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Signed Out State */
                            <>
                                <button
                                    onClick={handleAuthClick}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors group"
                                >
                                    <LogIn className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    <span>Log In</span>
                                </button>

                                <a
                                    href="#upload"
                                    className="relative group hidden md:block"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                                    <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Get Started</span>
                                    </div>
                                </a>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden absolute left-0 right-0 top-full mt-2 mx-4 sm:mx-6 overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl backdrop-blur-xl shadow-premium p-4">
                        {/* Mobile Navigation Links */}
                        <div className="space-y-1 mb-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                                >
                                    <link.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{link.name}</span>
                                </a>
                            ))}
                        </div>

                        {/* Mobile Auth Actions */}
                        {isSignedIn ? (
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">
                                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{userName || 'User'}</p>
                                        <p className="text-xs text-white/40">Signed In</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAuthClick}
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2 pt-4 border-t border-white/10">
                                <button
                                    onClick={handleAuthClick}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Log In
                                </button>
                                <a
                                    href="#upload"
                                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Get Started
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
        </header>
    );
};

export default Navbar;









