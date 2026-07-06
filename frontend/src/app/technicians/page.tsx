import { TechnicianCard } from "@/components/ui/TechnicianCard";
import { Search, MapPin } from "lucide-react";

const MOCK_TECHNICIANS = [
  {
    id: "tech-1",
    name: "Alex Johnson",
    bio: "Certified electronics repair specialist with 10+ years fixing smartphones, laptops, and tablets. Fast turnaround and guaranteed satisfaction.",
    hourlyRate: 65,
    rating: 4.9,
    reviewsCount: 124,
    distanceKm: 2.4,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "tech-2",
    name: "Sarah Williams",
    bio: "Master plumber. I handle everything from leaky faucets to full pipe replacements. Available for emergency calls 24/7.",
    hourlyRate: 85,
    rating: 4.7,
    reviewsCount: 89,
    distanceKm: 5.1,
    isVerified: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "tech-3",
    name: "Mike Davies",
    bio: "Appliance repair guru. Washers, dryers, refrigerators, and ovens. If it plugs in and stopped working, I can probably fix it.",
    hourlyRate: 70,
    rating: 4.5,
    reviewsCount: 42,
    distanceKm: 8.7,
    isVerified: false
  }
];

export default function TechniciansPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Find a Technician</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Connect with verified local professionals to help you fix your things.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by skill or name..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Zip code..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_TECHNICIANS.map((tech) => (
          <TechnicianCard key={tech.id} {...tech} />
        ))}
      </div>
    </div>
  );
}
