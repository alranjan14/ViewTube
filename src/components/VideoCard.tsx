import React from "react";
import { VideoSummary } from "../shared/types/api";

const VideoCard = ({ info }: { info: VideoSummary }) => {
  const { title, channelTitle, thumbnailUrl, viewCount } = info;

  return (
    <div className="p-2 m-2 w-72 shadow-lg">
      <img className="rounded-lg" alt="thumbnail" src={thumbnailUrl} />
      <ul>
        <li className="font-bold py-2">{title}</li>
        <li>{channelTitle}</li>
        <li>{viewCount ? `${viewCount} views` : ''}</li>
      </ul>
    </div>
  );
};

export const AdVideoCard = ({ info }: { info: VideoSummary }) => {
  return (
    <div className="p-1 m-1 border border-red-900 ">
      <VideoCard info={info} />
    </div>
  );
};

export default VideoCard;
