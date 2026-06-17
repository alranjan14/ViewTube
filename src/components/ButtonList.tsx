import React from "react";

const YOUTUBE_CATEGORIES = [
  { id: undefined, name: "All" },
  { id: "10", name: "Music" },
  { id: "20", name: "Gaming" },
  { id: "17", name: "Sports" },
  { id: "24", name: "Entertainment" },
  { id: "23", name: "Comedy" },
  { id: "28", name: "Science & Tech" },
  { id: "25", name: "News & Politics" },
  { id: "27", name: "Education" },
  { id: "22", name: "People & Blogs" },
  { id: "1", name: "Film & Animation" },
  { id: "2", name: "Autos & Vehicles" },
  { id: "15", name: "Pets & Animals" },
];

interface ButtonListProps {
  activeCategory?: string;
  setActiveCategory: (id?: string) => void;
}

const ButtonList = ({ activeCategory, setActiveCategory }: ButtonListProps) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-3 px-4 flex items-center gap-3">
      {YOUTUBE_CATEGORIES.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id || "all"}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonList;
