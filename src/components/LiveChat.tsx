import { Send, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../shared/ui/IconButton";
import { addMessage, ChatMessage } from "../utils/chatSlice";
import { generateRandomName, makeRandomMessage } from "../utils/helper";
import { RootState } from "../utils/store";
import ChatMessageComponent from "./ChatMessage";

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const LiveChat = () => {
  const [liveMessage, setLiveMessage] = useState("");
  const dispatch = useDispatch();

  const chatMessages = useSelector((store: RootState) => store.chat.messages);

  useEffect(() => {
    const i = setInterval(() => {
      // API Polling
      dispatch(
        addMessage({
          id: createMessageId(),
          name: generateRandomName(),
          message: makeRandomMessage(20),
        })
      );
    }, 2000);

    return () => clearInterval(i);
  }, [dispatch]);

  return (
    <div className="w-full h-[600px] flex flex-col border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800">Top chat</h3>
        <IconButton size="sm" aria-label="Close chat" onClick={() => {}}>
          <X size={20} className="text-slate-600" />
        </IconButton>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse custom-scrollbar py-2">
        <div>
          {chatMessages.map((c: ChatMessage) => (
            <ChatMessageComponent key={c.id} name={c.name} message={c.message} />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-100 p-3 bg-slate-50">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!liveMessage.trim()) return;
            
            dispatch(
              addMessage({
                id: createMessageId(),
                name: "You",
                message: liveMessage,
              })
            );
            setLiveMessage("");
          }}
        >
          <div className="flex-1 bg-white border border-slate-200 rounded-full flex items-center px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <input
              className="w-full bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-500"
              type="text"
              placeholder="Chat..."
              aria-label="Live chat message"
              value={liveMessage}
              onChange={(e) => setLiveMessage(e.target.value)}
            />
          </div>
          <IconButton 
            type="submit" 
            variant="solid" 
            className="flex-shrink-0 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={!liveMessage.trim()}
            aria-label="Send message"
          >
            <Send size={18} className="ml-0.5" />
          </IconButton>
        </form>
      </div>
    </div>
  );
};
export default LiveChat;
