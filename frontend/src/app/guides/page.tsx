import { GuideCard } from "@/components/ui/GuideCard";
import { Search, Filter } from "lucide-react";

// Mock data for Phase 3 static UI
const MOCK_GUIDES = [
  {
    slug: "replace-iphone-12-battery",
    title: "How to Replace an iPhone 12 Battery",
    difficulty: "MEDIUM" as const,
    category: "Smartphones",
    estimatedTime: 45,
    imageUrl: "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=600&auto=format&fit=crop"
  },
  {
    slug: "fix-leaky-faucet",
    title: "Fix a Leaky Bathroom Faucet",
    difficulty: "EASY" as const,
    category: "Plumbing",
    estimatedTime: 20,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop"
  },
  {
    slug: "repair-bike-flat-tire",
    title: "Repair a Flat Bicycle Tire",
    difficulty: "EASY" as const,
    category: "Bicycles",
    estimatedTime: 15,
  },
  {
    slug: "replace-laptop-screen",
    title: "Replace a Broken Laptop Screen",
    difficulty: "HARD" as const,
    category: "Computers",
    estimatedTime: 90,
  }
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Repair Guides</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Browse our community-sourced step-by-step guides to fix your stuff.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search guides..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_GUIDES.map((guide) => (
          <GuideCard key={guide.slug} {...guide} />
        ))}
      </div>
    </div>
  );
}
