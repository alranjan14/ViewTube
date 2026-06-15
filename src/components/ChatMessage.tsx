import UserAvatar from "./UserAvatar";

const ChatMessage = ({ name, message }: { name: string; message: string }) => {
  return (
    <div className="flex items-center shadow-sm p-2">
      <UserAvatar name={name} />
      <span className="font-bold px-2">{name}</span>
      <span>{message}</span>
    </div>
  );
};
export default ChatMessage;
