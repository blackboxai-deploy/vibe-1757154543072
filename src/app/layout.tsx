import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkTracker - URL Tracking & Analytics",
  description: "Create tracking links and get detailed analytics about your visitors' locations and behavior",
  keywords: "link tracking, URL shortener, analytics, visitor tracking, geolocation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LT</span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">LinkTracker</h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Dashboard</a>
                  <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                  <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">About</a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="border-t border-slate-200 bg-white/50 mt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-slate-600">
                <p>&copy; 2024 LinkTracker. Built for tracking and analytics.</p>
                <p className="text-sm mt-2">Monitor your links with precision and privacy.</p>
              </div>
            </div>
          </footer>
        </div>
        
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}