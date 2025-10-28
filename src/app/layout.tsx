
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/hooks/use-auth';
import 'leaflet/dist/leaflet.css';


export const metadata: Metadata = {
  title: 'TrackVerse',
  description: 'Track What Matters, Anytime, Anywhere.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
