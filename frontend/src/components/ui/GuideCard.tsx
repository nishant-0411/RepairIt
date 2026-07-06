import Link from "next/link";
import { Clock, Hammer, BarChart2 } from "lucide-react";
import clsx from "clsx";

export interface GuideCardProps {
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: string;
  estimatedTime: number;
  imageUrl?: string;
}

export function GuideCard({ slug, title, difficulty, category, estimatedTime, imageUrl }: GuideCardProps) {
  const difficultyColors = {
    EASY: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    HARD: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Link href={`/guides/${slug}`} className="group block">
      <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition-all duration-300">
        <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800 w-full overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-zinc-400">
              <Hammer className="w-12 h-12 opacity-50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-semibold bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-full uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          <div className="mt-auto flex items-center gap-4 text-sm font-medium">
            <div className={clsx("flex items-center gap-1 px-2.5 py-1 rounded-md", difficultyColors[difficulty])}>
              <BarChart2 className="w-4 h-4" />
              <span className="capitalize">{difficulty.toLowerCase()}</span>
            </div>
            
            <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
              <Clock className="w-4 h-4" />
              <span>{estimatedTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
