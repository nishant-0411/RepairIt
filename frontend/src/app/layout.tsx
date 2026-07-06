import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Wrench } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RepairIt | Fix it yourself or find a pro",
  description: "Community-driven repair guides and technician marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-zinc-50 dark:bg-zinc-950">
      <body className={`${inter.className} min-h-full flex flex-col text-zinc-900 dark:text-zinc-50`}>
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">RepairIt</span>
            </Link>
            <nav className="flex items-center gap-6 font-medium text-sm">
              <Link href="/guides" className="hover:text-blue-600 transition-colors">Guides</Link>
              <Link href="/technicians" className="hover:text-blue-600 transition-colors">Find a Pro</Link>
              <Link href="/troubleshoot" className="hover:text-blue-600 transition-colors">Troubleshoot</Link>
              <Link href="/login" className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                Sign In
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
          <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            <p>&copy; {new Date().getFullYear()} RepairIt. All rights reserved.</p>
            <p className="mt-2 max-w-md mx-auto text-xs">
              RepairIt provides guides for informational purposes only. Proceed at your own risk. 
              We are not liable for property damage or injuries caused by independent technicians.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
