import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleMenu } from "../utils/appSlice";
import { getSearchSuggestionsUrl } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";
import { RootState } from "../utils/store";
import UserAvatar from "./UserAvatar";

const Head = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchCache = useSelector((store: RootState) => store.search);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSearchSuggestions = async (query: string) => {
      try {
        const data = await fetch(getSearchSuggestionsUrl(query));
        const json = await data.json();
        const nextSuggestions = Array.isArray(json?.[1]) ? json[1] : [];

        setSuggestions(nextSuggestions);

        dispatch(
          cacheResults({
            [query]: nextSuggestions,
          })
        );
      } catch {
        setSuggestions([]);
      }
    };

    const query = searchQuery.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      if (searchCache[query]) {
        setSuggestions(searchCache[query]);
      } else {
        getSearchSuggestions(query);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, searchCache, searchQuery]);

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  return (
    <header className="sticky top-0 z-20 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMenuHandler}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          <span className="block h-0.5 w-5 bg-slate-900" />
          <span className="block h-0.5 w-5 bg-slate-900" />
          <span className="block h-0.5 w-5 bg-slate-900" />
        </button>
        <Link to="/" className="flex items-center gap-2" aria-label="VideoTube home">
          <span className="flex h-7 w-10 items-center justify-center rounded bg-red-600 text-xs font-bold text-white">
            Play
          </span>
          <span className="text-lg font-semibold tracking-normal">VideoTube</span>
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="flex">
          <input
            className="min-w-0 flex-1 rounded-l-full border border-slate-300 px-5 py-2 outline-none focus:border-blue-500"
            type="text"
            aria-label="Search videos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          />
          <button
            type="button"
            className="rounded-r-full border border-l-0 border-slate-300 bg-slate-100 px-5 py-2 hover:bg-slate-200"
          >
            Search
          </button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-12 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <ul role="listbox" aria-label="Search suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  role="option"
                  aria-selected={searchQuery === suggestion}
                  className="cursor-pointer rounded px-3 py-2 hover:bg-slate-100"
                  onMouseDown={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <UserAvatar name="Alok Ranjan" />
      </div>
    </header>
  );
};

export default Head;
