import { Menu, Search, Mic, Bell, Video, CircleUser, LogOut } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { login, logout } from "../utils/authSlice";
import { RootState } from "../utils/store";
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
  const [isListening, setIsListening] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();
        dispatch(
          login({
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
          })
        );
      } catch (error) {
        console.error("Failed to fetch user info", error);
        alert("Login failed. Please check your console.");
      }
    },
    onError: (error) => console.error("Login Failed", error),
  });
  
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

  const startVoiceSearch = () => {
    // @ts-ignore - SpeechRecognition is not in standard TS lib
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search. Try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
         alert(`Voice search error: ${event.error}`);
      }
    };

    recognition.start();
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

          {/* Search Suggestions Dropdown (Moved inside form for perfect width alignment) */}
          {showSuggestions && dropdownItems.length > 0 && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 text-left">
              <ul role="listbox" id="search-suggestions">
                {dropdownItems.map((item, index) => (
                  <li
                    key={`${showHistory ? 'history' : 'suggestion'}-${item}`}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer text-slate-700 font-medium transition-colors ${selectedIndex === index ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 group/item'}`}
                    onMouseDown={(e) => {
                      // Use onMouseDown instead of onClick so it fires before onBlur
                      e.preventDefault();
                      setSearchQuery(item);
                      handleSearch(item);
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <Search size={16} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate flex-1">{item}</span>
                    </div>
                    
                    {showHistory && (
                      <button
                        type="button"
                        className="text-blue-600 opacity-0 group-hover/item:opacity-100 transition-opacity text-sm hover:underline"
                        onMouseDown={(e) => {
                          e.preventDefault();
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
        </form>

        {/* Voice Search Button */}
        <IconButton 
          onClick={startVoiceSearch}
          className={`ml-3 hidden sm:inline-flex flex-shrink-0 transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse scale-105' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`} 
          aria-label="Search with your voice"
        >
          <Mic size={20} className={isListening ? 'text-red-600' : 'text-slate-700'} />
        </IconButton>

      </div>

      {/* Right section: Profile & Actions */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 relative">
        {isAuthenticated && (
          <IconButton className="hidden sm:inline-flex" aria-label="Notifications">
            <Bell size={20} className="text-slate-700" />
          </IconButton>
        )}
        
        {isAuthenticated && user ? (
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
              className="flex items-center gap-2 p-1 pl-2 pr-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors group border border-slate-200/50"
            >
              <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover shadow-sm" />
              <span className="text-sm font-semibold text-slate-700 hidden md:block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="flex items-start gap-3 px-4 py-3 border-b border-slate-100">
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-slate-900 truncate">{user.name}</span>
                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                  </div>
                </div>
                <ul className="py-2">
                  <li>
                    <button 
                      onMouseDown={() => dispatch(logout())}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <LogOut size={18} className="text-slate-400" />
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => handleGoogleLogin()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors font-medium shadow-sm shadow-blue-600/20"
          >
            <CircleUser size={18} />
            <span className="text-sm hidden sm:block">Sign in</span>
          </button>
        )}
      </div>
    </header>
    </>
  );
};

export default Head;
