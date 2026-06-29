import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';
import { STORAGE_KEYS } from '@/shared/config/storage';

const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  picture: z.string(),
});

export type User = z.infer<typeof UserSchema>;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Load (and validate) the persisted user. A malformed or tampered value is
// discarded rather than trusted, so we never hydrate state from an unexpected shape.
const loadUserFromStorage = (): User | null => {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    if (!savedUser) return null;
    const result = UserSchema.safeParse(JSON.parse(savedUser));
    return result.success ? result.data : null;
  } catch (e) {
    console.error('Failed to parse user from local storage', e);
    return null;
  }
};

const initialUser = loadUserFromStorage();

const initialState: AuthState = {
  user: initialUser,
  isAuthenticated: !!initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEYS.user);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
