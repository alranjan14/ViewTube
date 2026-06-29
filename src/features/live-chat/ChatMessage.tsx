import UserAvatar from '@/shared/ui/UserAvatar';

const ChatMessage = ({ name, message }: { name: string; message: string }) => {
  return (
    <div className="flex items-start gap-3 py-1.5 px-3 hover:bg-slate-50 transition-colors">
      <UserAvatar name={name} className="h-6 w-6 mt-0.5" />
      <div className="flex flex-col">
        <span className="font-semibold text-[13px] text-slate-500">{name}</span>
        <span className="text-sm text-slate-900 leading-snug">{message}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
