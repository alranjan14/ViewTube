import { describe, expect, it } from 'vitest';
import chatReducer, { addMessage, type ChatMessage } from './chatSlice';
import { LIVE_CHAT_COUNT } from '@/shared/lib/constants';

const msg = (id: string): ChatMessage => ({
  id,
  name: `user-${id}`,
  message: `hello ${id}`,
});

describe('chatSlice', () => {
  it('appends a message', () => {
    const state = chatReducer(undefined, addMessage(msg('1')));
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toMatchObject({ id: '1', name: 'user-1' });
  });

  it('caps the buffer at LIVE_CHAT_COUNT, dropping the oldest', () => {
    let state = chatReducer(undefined, { type: '@@INIT' });
    for (let i = 0; i < LIVE_CHAT_COUNT + 5; i++) {
      state = chatReducer(state, addMessage(msg(String(i))));
    }
    expect(state.messages).toHaveLength(LIVE_CHAT_COUNT);
    // 30 added, 25 kept ⇒ 5 shifted out (ids 0..4); oldest kept is id '5'.
    expect(state.messages[0]?.id).toBe('5');
    expect(state.messages.at(-1)?.id).toBe(String(LIVE_CHAT_COUNT + 4));
  });
});
