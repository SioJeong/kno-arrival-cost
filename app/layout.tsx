import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from './components/Header';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAnalytics } from '@next/third-parties/google';

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
                    h-screen 
                    flex 
                    flex-col
                    bg-background
                    overflow-hidden
                `}
            >
                <Header />
                <main className="flex flex-1 w-full overflow-hidden">
                    <div className="flex-1 h-full p-4 md:p-8">{children}</div>
                </main>
                <Toaster />
            </body>
            <GoogleAnalytics gaId="G-B67F2F5XGS" />
        </html>
    );
}
