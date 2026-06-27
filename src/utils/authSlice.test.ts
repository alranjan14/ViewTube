import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../shared/config/storage';
import authReducer, { login, logout } from './authSlice';

const user = {
  name: 'Ada',
  email: 'ada@example.com',
  picture: 'http://img/ada.png',
};

describe('authSlice reducers', () => {
  beforeEach(() => localStorage.clear());

  it('login sets the user, flips isAuthenticated and persists to storage', () => {
    const state = authReducer(undefined, login(user));
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.user)).toBe(JSON.stringify(user));
  });

  it('logout clears the user, the flag and storage', () => {
    const loggedIn = authReducer(undefined, login(user));
    const state = authReducer(loggedIn, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEYS.user)).toBeNull();
  });
});

describe('authSlice hydration (Zod-validated)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('hydrates a valid persisted user on load', async () => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    const fresh = await import('./authSlice');
    const state = fresh.default(undefined, { type: '@@INIT' });
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it('discards a malformed persisted user on load', async () => {
    localStorage.setItem(
      STORAGE_KEYS.user,
      JSON.stringify({ name: 'missing email + picture' })
    );
    const fresh = await import('./authSlice');
    const state = fresh.default(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('ignores non-JSON garbage in storage', async () => {
    localStorage.setItem(STORAGE_KEYS.user, 'not-json{');
    const fresh = await import('./authSlice');
    const state = fresh.default(undefined, { type: '@@INIT' });
    expect(state.user).toBeNull();
  });
});
