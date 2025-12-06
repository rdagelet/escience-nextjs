'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link href="/" className="nav-logo">
                    <img src="/assets/images/escience-logo.png" alt="eScience - Transforming the AI-Driven Enterprise" className="nav-logo-img" />
                    <span className="text-[10px] text-gray-500 ml-2 mt-1 self-start font-mono opacity-60">v1.2</span>
                </Link>
                <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <Link href="/#solutions">Solutions</Link>
                    <Link href="/#why-us">Why Us</Link>
                    <Link href="/blog">Resources</Link>
                    <Link href="/#testimonials">Testimonials</Link>
                    <Link href="/#contact" className="nav-cta">Get Started</Link>
                </div>
                <div className={`nav-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
}
