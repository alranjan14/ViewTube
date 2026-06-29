import { Flame, Music, Gamepad2, Trophy, Newspaper } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import VideoContainer from '@/entities/video/VideoContainer';

const CATEGORIES = [
  {
    id: '0',
    name: 'Trending',
    icon: Flame,
    color: 'bg-red-500',
    to: '/explore',
  },
  {
    id: '10',
    name: 'Music',
    icon: Music,
    color: 'bg-yellow-500',
    to: '/explore?category=10',
  },
  {
    id: '20',
    name: 'Gaming',
    icon: Gamepad2,
    color: 'bg-blue-500',
    to: '/explore?category=20',
  },
  {
    id: '25',
    name: 'News',
    icon: Newspaper,
    color: 'bg-indigo-500',
    to: '/explore?category=25',
  },
  {
    id: '17',
    name: 'Sports',
    icon: Trophy,
    color: 'bg-green-500',
    to: '/explore?category=17',
  },
];

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || undefined;

  return (
    <div className="flex flex-col w-full h-full relative p-4 sm:p-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Explore</h1>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.to}
            className={`${cat.color} hover:opacity-90 transition-opacity rounded-xl p-4 flex flex-col items-center justify-center gap-3 text-white shadow-sm h-24 sm:h-32`}
          >
            <cat.icon size={32} strokeWidth={1.5} />
            <span className="font-semibold tracking-wide text-sm sm:text-base">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="h-px bg-slate-200 w-full mb-8" />

      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {categoryId
          ? CATEGORIES.find((c) => c.id === categoryId)?.name
          : 'Trending Now'}
      </h2>

      {/* Videos List */}
      <div className="flex-1">
        <VideoContainer activeCategory={categoryId} />
      </div>
    </div>
  );
};

export default ExplorePage;
