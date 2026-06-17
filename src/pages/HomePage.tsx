import React, { useState } from "react";
import ButtonList from "../components/ButtonList";
import VideoContainer from "../components/VideoContainer";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="sticky top-[60px] z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <ButtonList activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>
      <div className="flex-1">
        <VideoContainer activeCategory={activeCategory} />
      </div>
    </div>
  );
};

export default HomePage;
