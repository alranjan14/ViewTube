import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import chatReducer from "./chatSlice";
import authReducer from "./authSlice";

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
