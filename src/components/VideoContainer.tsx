import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularVideosUrl, YOUTUBE_API_KEY } from "../utils/constants";
import VideoCard, { AdVideoCard, VideoInfo } from "./VideoCard";

const VideoContainer = () => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    if (!YOUTUBE_API_KEY) {
      setError("Add REACT_APP_YOUTUBE_API_KEY to your local environment to load videos.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await fetch(getPopularVideosUrl());
      const json = await data.json();

      if (!data.ok) {
        throw new Error(json?.error?.message || "Unable to load videos.");
      }

      setVideos(Array.isArray(json.items) ? json.items : []);
    } catch (apiError: any) {
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-slate-600">Loading videos...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-700">{error}</div>;
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
