import { Menu, Search, Mic, Bell, Video, CircleUser } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSearchSuggestions } from "../shared/hooks/queries";
import { useDebounce } from "../shared/hooks/useDebounce";
import { useSearchHistory } from "../shared/hooks/useSearchHistory";
import { ROUTES } from "../shared/routes";
import IconButton from "../shared/ui/IconButton";
import { toggleMenu } from "../utils/appSlice";

const Head = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: suggestions = [] } = useSearchSuggestions(debouncedSearchQuery);
  const { history, addSearch, removeSearch } = useSearchHistory();

  // Determine what to show in the dropdown
  const showHistory = !debouncedSearchQuery.trim() && history.length > 0;
  const dropdownItems = showHistory ? history : suggestions;

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    addSearch(query);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    navigate(`${ROUTES.SEARCH}?search_query=${encodeURIComponent(query)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < dropdownItems.length) {
      handleSearch(dropdownItems[selectedIndex]);
    } else {
      handleSearch(searchQuery);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || dropdownItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < dropdownItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <>
      <a href="#main-content" className="absolute top-0 left-0 z-[100] p-3 -translate-y-full focus:translate-y-0 bg-blue-600 text-white font-bold transition-transform">
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 lg:px-6 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm transition-all">
      {/* Left section: Menu & Logo */}
      <div className="flex items-center gap-4">
        <IconButton onClick={() => dispatch(toggleMenu())} aria-label="Toggle Menu">
          <Menu className="text-slate-700" />
        </IconButton>
        
        <Link to="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1" aria-label="ViewTube Home">
          <div className="bg-red-600 text-white p-1 rounded-lg group-hover:scale-105 transition-transform shadow-md shadow-red-600/20">
            <Video size={20} className="fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">ViewTube</span>
        </Link>
      </div>

      {/* Center section: Search Bar */}
      <div className="flex-1 max-w-2xl px-4 lg:px-12 ml-4 sm:ml-0 flex justify-end sm:justify-center relative">
        <form 
          className="flex w-full relative group transition-all duration-300 shadow-sm hover:shadow-md focus-within:shadow-md rounded-full bg-slate-100/50 border border-slate-200/80 focus-within:border-blue-500/50 focus-within:bg-white" 
          onSubmit={onSubmit}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            className="w-full bg-transparent border-none pl-6 group-focus-within:pl-12 pr-4 py-2.5 outline-none text-slate-900 placeholder:text-slate-500 transition-all rounded-l-full"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={onKeyDown}
            aria-label="Search queries"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          />
          <button
            type="submit"
            className="px-6 border-l border-slate-200/80 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 transition-colors rounded-r-full flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Voice Search Button */}
        <IconButton className="ml-3 hidden sm:inline-flex bg-slate-100 hover:bg-slate-200 flex-shrink-0" aria-label="Search with your voice">
          <Mic size={20} className="text-slate-700" />
        </IconButton>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && dropdownItems.length > 0 && (
          <div className="absolute top-14 left-4 lg:left-12 right-4 lg:right-12 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <ul role="listbox" id="search-suggestions">
              {dropdownItems.map((item, index) => (
                <li
                  key={`${showHistory ? 'history' : 'suggestion'}-${item}`}
                  id={`suggestion-${index}`}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer text-slate-700 font-medium transition-colors ${selectedIndex === index ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 group/item'}`}
                >
                  <div 
                    className="flex items-center gap-3 flex-1 overflow-hidden"
                    onClick={() => {
                      setSearchQuery(item);
                      handleSearch(item);
                    }}
                  >
                    <Search size={16} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate flex-1">{item}</span>
                  </div>
                  
                  {showHistory && (
                    <button
                      type="button"
                      className="text-blue-600 opacity-0 group-hover/item:opacity-100 transition-opacity text-sm hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(item);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right section: Profile & Actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <IconButton className="hidden sm:inline-flex" aria-label="Notifications">
          <Bell size={20} className="text-slate-700" />
        </IconButton>
        <button className="flex items-center gap-2 p-1 pl-2 pr-4 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors group">
          <CircleUser size={24} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-sm font-semibold text-slate-700 hidden md:block">Alok</span>
        </button>
      </div>
    </header>
    </>
  );
};

export default Head;
