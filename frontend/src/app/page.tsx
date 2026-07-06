import Link from "next/link";
import { ArrowRight, Search, Hammer, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center flex-1">
      {/* Hero Section */}
      <section className="w-full py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Fix it yourself, <br /> or find a pro.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
            Join the community repairing the world. Access free step-by-step guides, use our AI troubleshooting assistant, or hire a verified technician near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/guides" 
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              <Hammer className="w-5 h-5" />
              Browse Guides
            </Link>
            <Link 
              href="/technicians" 
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-full hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 transition-all"
            >
              <Search className="w-5 h-5" />
              Find a Technician
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Hammer className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">DIY Repair Guides</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Community-sourced instructions for fixing everything from smartphones to home appliances.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Hire Local Pros</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Find reviewed and rated technicians near you. Secure booking and transparent pricing.
            </p>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI Troubleshooting</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Describe your problem to our smart assistant and get instant diagnostic advice and relevant guides.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 bg-zinc-900 dark:bg-zinc-900 text-white">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Are you a repair expert?</h2>
          <p className="text-lg text-zinc-300 max-w-xl mb-8">
            Turn your skills into income. Join our marketplace to connect with people who need your help.
          </p>
          <Link 
            href="/login" 
            className="flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-bold rounded-full hover:bg-zinc-100 hover:scale-105 transition-transform"
          >
            Become a Technician <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
