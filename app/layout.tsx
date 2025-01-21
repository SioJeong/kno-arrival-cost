import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import HeaderNavigation from './components/HeaderNavigation';
import { Toaster } from '@/components/ui/sonner';

const suit = localFont({
    src: './fonts/SUIT-Variable.woff2',
    variable: '--font-suit',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'K&O INTERNATIONAL',
    description: 'K&O INTERNATIONAL 국내 도착가 계산기입니다.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${suit.variable} antialiased`}>
                <HeaderNavigation />
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
