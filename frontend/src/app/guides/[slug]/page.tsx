import { Clock, Hammer, BarChart2, ChevronLeft, Wrench } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Mock data for Phase 3 static UI based on slug
  const mockGuide = {
    title: `Guide: ${resolvedParams.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
    difficulty: "MEDIUM",
    category: "Electronics",
    estimatedTime: 45,
    author: "Jane DIY",
    steps: [
      { id: 1, instruction: "Turn off the device and ensure it is unplugged from any power source." },
      { id: 2, instruction: "Use a Phillips #00 screwdriver to remove the two screws at the bottom." },
      { id: 3, instruction: "Carefully insert an opening pick between the screen and the frame." },
      { id: 4, instruction: "Pry open the screen and disconnect the battery cable." }
    ],
    tools: [
      { id: "t1", name: "Phillips #00 Screwdriver" },
      { id: "t2", name: "Opening Picks" },
      { id: "t3", name: "Spudger" }
    ]
  };

  const difficultyColors = {
    EASY: "text-green-600 dark:text-green-400",
    MEDIUM: "text-yellow-600 dark:text-yellow-400",
    HARD: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/guides" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Guides
      </Link>
      
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-full uppercase tracking-wider">
            {mockGuide.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">{mockGuide.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {mockGuide.author.charAt(0)}
            </div>
            <span>By {mockGuide.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="w-5 h-5" />
            <span className={clsx("capitalize font-semibold", difficultyColors[mockGuide.difficulty as keyof typeof difficultyColors])}>
              {mockGuide.difficulty.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-5 h-5" />
            <span>{mockGuide.estimatedTime} minutes</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold">Step-by-Step Instructions</h2>
          {mockGuide.steps.map((step) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-lg">
                {step.id}
              </div>
              <div className="pt-1.5">
                <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Required Tools
            </h3>
            <ul className="space-y-3">
              {mockGuide.tools.map(tool => (
                <li key={tool.id} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
