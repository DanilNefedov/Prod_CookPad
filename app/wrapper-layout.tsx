'use client';

import { usePathname } from 'next/navigation';
import React from 'react';




export default function WrapperLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/register' || pathname === '/login';

    return (
        <div className={isAuthPage ? 'wrapper over' : 'wrapper non-over'}>
            {children}
        </div>
    );
}
