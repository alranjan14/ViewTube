import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import React from 'react';
import { useVideoComments } from '../shared/hooks/queries';
import { CommentData } from '../shared/types/api';
import Skeleton from '../shared/ui/Skeleton';

const Comment = ({ data }: { data: CommentData }) => {
  const { name, text, authorProfileImageUrl, publishedAt } = data;
  return (
    <div className="flex gap-4 p-3 hover:bg-slate-50 transition-colors rounded-xl">
      {authorProfileImageUrl ? (
        <img
          src={authorProfileImageUrl}
          alt={name}
          className="h-10 w-10 mt-1 rounded-full shadow-sm border border-slate-100 object-cover"
        />
      ) : (
        <div className="h-10 w-10 mt-1 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-slate-500 font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-900">{name}</span>
          <span className="text-xs text-slate-500">
            {new Date(publishedAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-slate-800 text-sm mt-1 whitespace-pre-wrap">
          {text}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <button className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
            <ThumbsUp size={14} />
          </button>
          <button className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
            <ThumbsDown size={14} />
          </button>
          <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors rounded-full px-2 py-1 hover:bg-slate-200">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentsList = ({ comments }: { comments: CommentData[] }) => {
  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex flex-col">
          <Comment data={comment} />
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-12 ml-4 border-l-2 border-slate-100 mt-1">
              <CommentsList comments={comment.replies} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const CommentsContainer = ({ videoId }: { videoId: string }) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideoComments(videoId);

  if (isLoading) {
    return (
      <div className="mt-6 w-full flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-3">
            <Skeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
            <div className="flex flex-col gap-2 w-full pt-1">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-2/3 h-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
        Failed to load comments: {error.message}
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center gap-2 mb-6 px-2">
        <h2 className="text-xl font-bold">Comments</h2>
        <MessageSquare size={20} className="text-slate-400" />
      </div>

      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          <CommentsList comments={page.items} />
        </React.Fragment>
      ))}

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-full transition-colors disabled:opacity-50 text-sm"
          >
            {isFetchingNextPage ? 'Loading...' : 'Show More Comments'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsContainer;
