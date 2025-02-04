import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
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
            <body
                className={`
                    ${suit.variable} 
                    antialiased 
                    min-h-screen 
                    flex 
                    flex-col
                    bg-background
                `}
            >
                <Header />
                <main className="flex `flex-1 w-full px-4 py-2 md:px-8 md:py-4">{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
