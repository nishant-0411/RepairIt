import { Star, MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";

export interface TechnicianCardProps {
  id: string;
  name: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  isVerified: boolean;
  avatarUrl?: string;
}

export function TechnicianCard({ 
  id, 
  name, 
  bio, 
  hourlyRate, 
  rating, 
  reviewsCount, 
  distanceKm, 
  isVerified,
  avatarUrl 
}: TechnicianCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="md:w-1/3 relative h-48 md:h-auto bg-zinc-100 dark:bg-zinc-800 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold text-3xl">
            {name.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{name}</h3>
              {isVerified && (
                <span title="Verified Technician">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-zinc-900 dark:text-zinc-50">{rating.toFixed(1)}</span>
                <span>({reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{distanceKm} km away</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">${hourlyRate}</span>
            <span className="text-sm font-medium text-zinc-500">per hour</span>
          </div>
        </div>
        
        <p className="mt-4 text-zinc-600 dark:text-zinc-300 line-clamp-2">
          {bio}
        </p>
        
        <div className="mt-6 flex gap-3">
          <Link 
            href={`/technicians/${id}`}
            className="flex-1 text-center py-2.5 px-4 font-semibold border-2 border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            View Profile
          </Link>
          <button className="flex-1 py-2.5 px-4 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
