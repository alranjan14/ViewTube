import { generatePath, ROUTES } from './index';

describe('Routing Helpers', () => {
  it('should return correct path without params', () => {
    expect(ROUTES.HOME).toBe('/');
  });

  it('should generate path with params correctly', () => {
    const path = generatePath(ROUTES.CHANNEL, { channelId: '123' });
    expect(path).toBe('/channel/123');
  });

  it('should handle missing params gracefully by returning unreplaced template if not provided', () => {
    const path = generatePath(ROUTES.WATCH);
    expect(path).toBe('/watch');
  });
});
