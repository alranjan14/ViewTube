import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CommentsContainer from "../components/CommentsContainer";
import LiveChat from "../components/LiveChat";
import { useVideoDetails } from "../shared/hooks/queries";
import { useLibrary } from "../shared/hooks/useLibrary";
import { closeMenu } from "../utils/appSlice";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");

  const dispatch = useDispatch();
  const { data: videoDetails } = useVideoDetails(videoId || "");
  const { addToHistory } = useLibrary();

  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  useEffect(() => {
    if (videoDetails) {
      addToHistory(videoDetails);
    }
  }, [videoDetails, addToHistory]);

  if (!videoId) {
    return <div className="p-6 text-sm text-red-700">Missing video id.</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full flex-col gap-4 px-5 lg:flex-row">
        <div className="w-full lg:w-2/3">
          <iframe
            className="aspect-video w-full"
            src={"https://www.youtube.com/embed/" + videoId}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="w-full">
          <LiveChat />
        </div>
      </div>
      <CommentsContainer />
    </div>
  );
};

export default WatchPage;
