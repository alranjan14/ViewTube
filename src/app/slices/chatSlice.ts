import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LIVE_CHAT_COUNT } from '@/shared/lib/constants';

export interface ChatMessage {
  id: string;
  name: string;
  message: string;
}

interface ChatState {
  messages: ChatMessage[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      if (state.messages.length > LIVE_CHAT_COUNT) {
        state.messages.shift();
      }
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
