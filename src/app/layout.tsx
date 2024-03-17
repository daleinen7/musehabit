import type { Metadata } from 'next';
import { Hepta_Slab, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { AuthContextProvider } from './context/AuthContext';
import './globals.css';
import Nav from './components/Nav';

const satoshi = localFont({
  src: [{ path: './fonts/Satoshi-Variable.ttf' }],
  variable: '--font-satoshi',
});

const satoshiItalic = localFont({
  src: [{ path: './fonts/Satoshi-VariableItalic.ttf' }],
  variable: '--font-satoshi-italic',
});

const hepta = Hepta_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-hepta',
});

export const metadata: Metadata = {
  title: 'Musehabit',
  description: 'An online open mic',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${satoshiItalic} ${hepta.variable}  min-h-screen`}
      >
        <AuthContextProvider>
          <header>
            <Nav />
          </header>
          <main className="flex flex-col items-center justify-start min-h-[100vh]">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  );
}
