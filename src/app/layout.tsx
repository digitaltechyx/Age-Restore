import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext';
import { WhatsAppFloat } from '@/components/whatsapp-float';

export const metadata: Metadata = {
  title: 'Age Restore - Bring Back Confidence',
  description: 'Capture Your 30-Day Journey with Age Restore - A beautiful photo journaling application for your transformation',
  icons: {
    icon: [
      { url: '/logo.avif', sizes: '40x40', type: 'image/avif' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.avif', sizes: '40x40', type: 'image/avif' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
                   <body className="font-body antialiased">
               <AuthProvider>
                 {children}
                 <Toaster />
                 <WhatsAppFloat />
               </AuthProvider>
             </body>
    </html>
  );
}
