import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@/app/slices/appSlice';
import authReducer from '@/app/slices/authSlice';
import chatReducer from '@/app/slices/chatSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    chat: chatReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
