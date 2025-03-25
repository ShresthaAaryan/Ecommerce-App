'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ShoppingCart, ShoppingBag, User, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        setIsLoggedIn(!!userData);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        router.push('/login');
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/categories', label: 'Categories' },
        { href: '/about', label: 'About' },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
                ? 'bg-background/80 backdrop-blur-md border-b'
                : 'md:bg-transparent bg-background/80 backdrop-blur-md'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Name */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-xl font-bold hover:text-primary transition-colors"
                    >
                        {/* For example, using a ShoppingBag icon as your brand logo */}
                        <ShoppingBag className="h-8 w-8 text-primary" />
                        <span>EcoShop</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Dedicated Cart Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/cart')}
                            className="relative"
                        >
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            <span className="sr-only">Cart</span>
                        </Button>

                        {/* Profile Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/profile')}
                            className="relative"
                        >
                            <User className="h-6 w-6 text-primary" />
                            <span className="sr-only">Profile</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push('/cart')}
                                    className="relative"
                                >
                                    <ShoppingCart className="h-6 w-6 text-primary" />
                                    <span className="sr-only">Cart</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2"
                                    onClick={() => {
                                        router.push('/profile');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <User className="h-5 w-5" />
                                    Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
