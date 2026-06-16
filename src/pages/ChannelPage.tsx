import React from "react";
import { useParams } from "react-router-dom";

const ChannelPage = () => {
  const { channelId } = useParams();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold">Channel Page</h1>
      <p className="mt-4">Placeholder for channel: {channelId}</p>
    </div>
  );
};

export default ChannelPage;
