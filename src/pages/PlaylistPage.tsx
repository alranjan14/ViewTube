import React from "react";
import { useParams } from "react-router-dom";

const PlaylistPage = () => {
  const { playlistId } = useParams();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold">Playlist Page</h1>
      <p className="mt-4">Placeholder for playlist: {playlistId}</p>
    </div>
  );
};

export default PlaylistPage;
