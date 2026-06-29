import { describe, expect, it } from 'vitest';
import appReducer, { closeMenu, toggleMenu } from './appSlice';

describe('appSlice', () => {
  it('starts with the menu open', () => {
    const state = appReducer(undefined, { type: '@@INIT' });
    expect(state.isMenuOpen).toBe(true);
  });

  it('toggleMenu flips the flag', () => {
    const open = appReducer(undefined, { type: '@@INIT' });
    const closed = appReducer(open, toggleMenu());
    expect(closed.isMenuOpen).toBe(false);
    expect(appReducer(closed, toggleMenu()).isMenuOpen).toBe(true);
  });

  it('closeMenu always sets the flag false', () => {
    const open = appReducer(undefined, { type: '@@INIT' });
    expect(appReducer(open, closeMenu()).isMenuOpen).toBe(false);
    // idempotent
    expect(appReducer({ isMenuOpen: false }, closeMenu()).isMenuOpen).toBe(
      false
    );
  });
});
