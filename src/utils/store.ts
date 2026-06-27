import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";

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
