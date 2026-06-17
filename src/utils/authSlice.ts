import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Load initial state from local storage if available
const loadUserFromStorage = (): User | null => {
  try {
    const savedUser = localStorage.getItem("viewtube_user");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (e) {
    console.error("Failed to parse user from local storage", e);
  }
  return null;
};

const initialUser = loadUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("viewtube_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("viewtube_user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
