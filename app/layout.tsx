import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'TechexaVision Admin Dashboard',
  description: 'High-end admin dashboard for TechexaVision backend analytics and system health.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-shell min-h-screen bg-[#0b1120] text-white">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
