import { Home, Compass, PlaySquare, Clock, History, ThumbsUp, Flame, Music, Gamepad2, Trophy, ListVideo } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../shared/routes";
import { RootState } from "../utils/store";

const SidebarItem = ({ icon: Icon, label, to, isMenuOpen }: { icon: React.ElementType; label: string; to: string; isMenuOpen: boolean }) => {
  const location = useLocation();
  const currentPath = location.pathname + location.search + location.hash;
  
  let isActive = currentPath === to;
  if (to === ROUTES.HOME && location.pathname === ROUTES.HOME) {
    isActive = true;
  }
  if (location.pathname === ROUTES.LIBRARY && !location.hash && to === `${ROUTES.LIBRARY}#history`) {
    isActive = true;
  }

  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={`flex items-center ${isMenuOpen ? 'flex-row px-4 py-3 gap-4' : 'flex-col justify-center px-1 py-4 gap-1'} rounded-xl transition-all duration-200 group
      ${isActive ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`}
    >
      <Icon size={isMenuOpen ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} className={`flex-shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`} />
      <span className={`truncate text-slate-900 ${isMenuOpen ? 'text-sm' : 'text-[10px]'}`}>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const isMenuOpen = useSelector((store: RootState) => store.app.isMenuOpen);

  return (
    <aside aria-label="Primary navigation" className={`sticky top-16 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar flex-shrink-0 hidden sm:block border-r border-slate-200/50 bg-white/50 backdrop-blur-md transition-all duration-300 ${isMenuOpen ? 'w-64 px-3' : 'w-20 px-1'}`}>
      <div className="py-3 flex flex-col gap-1">
        <SidebarItem icon={Home} label="Home" to={ROUTES.HOME} isMenuOpen={isMenuOpen} />
        <SidebarItem icon={Compass} label="Explore" to="/explore" isMenuOpen={isMenuOpen} />
        <SidebarItem icon={PlaySquare} label="Subscriptions" to="/subscriptions" isMenuOpen={isMenuOpen} />
      </div>
      
      {isMenuOpen && (
        <>
          <div className="h-px bg-slate-200 my-2 mx-2"></div>
          <div className="py-3 flex flex-col gap-1">
            <h3 className="px-4 text-base font-semibold mb-1 text-slate-900">You</h3>
            <SidebarItem icon={History} label="History" to={`${ROUTES.LIBRARY}#history`} isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Clock} label="Watch Later" to={`${ROUTES.LIBRARY}#watch-later`} isMenuOpen={isMenuOpen} />
            <SidebarItem icon={ListVideo} label="Playlists" to={`${ROUTES.LIBRARY}#playlists`} isMenuOpen={isMenuOpen} />
          </div>
          
          <div className="h-px bg-slate-200 my-2 mx-2"></div>
          <div className="py-3 flex flex-col gap-1">
            <h3 className="px-4 text-base font-semibold mb-1 text-slate-900">Explore</h3>
            <SidebarItem icon={Flame} label="Trending" to="/explore" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Music} label="Music" to="/explore?category=10" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Gamepad2} label="Gaming" to="/explore?category=20" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Trophy} label="Sports" to="/explore?category=17" isMenuOpen={isMenuOpen} />
          </div>
          
          <div className="h-px bg-slate-200 my-2 mx-2"></div>
          <div className="px-4 py-4 mt-auto">
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
              <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors">Terms of Service</a>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
              Data provided by YouTube API. Not affiliated with YouTube or Google LLC.
            </p>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              © {new Date().getFullYear()} ViewTube
            </p>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
