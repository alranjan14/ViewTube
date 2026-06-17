import { Home, Compass, PlaySquare, Clock, History, ThumbsUp, Flame, Music, Gamepad2, Trophy } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../shared/routes";
import { RootState } from "../utils/store";

const SidebarItem = ({ icon: Icon, label, to, isMenuOpen }: { icon: React.ElementType; label: string; to: string; isMenuOpen: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

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
            <SidebarItem icon={History} label="History" to={ROUTES.LIBRARY} isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Clock} label="Watch Later" to="/watch-later" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={ThumbsUp} label="Liked videos" to="/liked" isMenuOpen={isMenuOpen} />
          </div>
          
          <div className="h-px bg-slate-200 my-2 mx-2"></div>
          <div className="py-3 flex flex-col gap-1">
            <h3 className="px-4 text-base font-semibold mb-1 text-slate-900">Explore</h3>
            <SidebarItem icon={Flame} label="Trending" to="/trending" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Music} label="Music" to="/music" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Gamepad2} label="Gaming" to="/gaming" isMenuOpen={isMenuOpen} />
            <SidebarItem icon={Trophy} label="Sports" to="/sports" isMenuOpen={isMenuOpen} />
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
