import React from "react";
import UserAvatar from "./UserAvatar";

const commentsData = [
  {
    name: "Alok Ranjan",
    text: "What a video! ",
    replies: [],
  },
  {
    name: "Alok Ranjan",
    text: "What a video! ",
    replies: [
      {
        name: "Alok Ranjan",
        text: "What a video! ",
        replies: [],
      },
      {
        name: "Alok Ranjan",
        text: "What a video! ",
        replies: [
          {
            name: "Alok Ranjan",
            text: "What a video! ",
            replies: [
              {
                name: "Alok Ranjan",
                text: "What a video! ",
                replies: [
                  {
                    name: "Alok Ranjan",
                    text: "What a video! ",
                    replies: [
                      {
                        name: "Alok Ranjan",
                        text: "What a video! ",
                        replies: [],
                      },
                    ],
                  },
                  {
                    name: "Alok Ranjan",
                    text: "What a video! ",
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Alok Ranjan",
    text: "What a video! ",
    replies: [],
  },
  {
    name: "Alok Ranjan",
    text: "What a video! ",
    replies: [],
  }
];

export interface CommentData {
  name: string;
  text: string;
  replies: CommentData[];
}

const Comment = ({ data }: { data: CommentData }) => {
  const { name, text } = data;
  return (
    <div className="flex shadow-sm bg-gray-100 p-2 rounded-lg my-2">
      <UserAvatar name={name} className="h-12 w-12" />
      <div className="px-3">
        <p className="font-bold">{name}</p>
        <p>{text}</p>
      </div>
    </div>
  );
};

const CommentsList = ({ comments }: { comments: CommentData[] }) => {
  // Disclaimer: Don't use indexes as keys
  return comments.map((comment, index) => (
    <div key={index}>
      <Comment data={comment} />
      <div className="pl-5 border border-l-black ml-5">
        <CommentsList comments={comment.replies} />
      </div>
    </div>
  ));
};

const CommentsContainer = () => {
  return (
    <div className="m-5 p-2">
      <h1 className="text-2xl font-bold">Comments: </h1>
      <CommentsList comments={commentsData} />
    </div>
  );
};

export default CommentsContainer;
