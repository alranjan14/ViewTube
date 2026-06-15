import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../utils/store";

const Sidebar = () => {
  const isMenuOpen = useSelector((store: RootState) => store.app.isMenuOpen);

  if (!isMenuOpen) return null;

  return (
    <nav className="w-48 p-5 shadow-lg" aria-label="Primary navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li> Shorts</li>
        <li> Videos</li>
        <li> Live</li>
      </ul>
      <h1 className="font-bold pt-5">Subscriptions</h1>
      <ul>
        <li> Music</li>
        <li> Sports</li>
        <li> Gaming</li>
        <li> Movies</li>
      </ul>
      <h1 className="font-bold pt-5">Watch Later</h1>
      <ul>
        <li> Music</li>
        <li> Sports</li>
        <li> Gaming</li>
        <li> Movies</li>
      </ul>
    </nav>
  );
};

export default Sidebar;
