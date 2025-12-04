'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [status, router, pathname]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (status === 'loading') {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Blogs', href: '/admin/blogs', icon: '📝' },
        { name: 'Products', href: '/admin/products', icon: '📦' },
        { name: 'Careers', href: '/admin/careers', icon: '💼' },
        { name: 'Testimonials', href: '/admin/testimonials', icon: '💬' },
        { name: 'Chat Logs', href: '/admin/chats', icon: '🤖' },
    ];

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/5 border-r border-white/10 fixed h-full z-10 hidden md:block">
                <div className="p-6">
                    <Image src="/assets/images/escience-logo.png" alt="Logo" width={120} height={30} />
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                            {session.user?.name?.[0] || 'A'}
                        </div>
                        <div className="text-sm">
                            <p className="text-white font-medium">{session.user?.name}</p>
                            <p className="text-gray-500 text-xs truncate w-32">{session.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 py-2 rounded-lg text-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
