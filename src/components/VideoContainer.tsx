import React from "react";
import { Link } from "react-router-dom";
import { useTrendingVideos } from "../shared/hooks/queries";
import VideoCard, { AdVideoCard } from "./VideoCard";

const VideoContainer = () => {
  const { data: videos = [], isLoading, error } = useTrendingVideos();

  if (isLoading) {
    return <div className="p-6 text-slate-600">Loading videos...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-700">{error.message}</div>;
  }

  return (
    <div className="flex flex-wrap">
      {videos[0] && <AdVideoCard info={videos[0]} />}
      {videos.map((video) => (
        <Link key={video.id} to={"/watch?v=" + video.id}>
          <VideoCard info={video} />
        </Link>
      ))}
    </div>
  );
};

export default VideoContainer;
