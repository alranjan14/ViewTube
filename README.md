# YouTube Clone

A React-based YouTube-inspired video discovery app.

## Setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Create a local environment file:

   ```sh
   cp .env.example .env.local
   ```

3. Add a restricted YouTube Data API key to `.env.local`:

   ```txt
   REACT_APP_YOUTUBE_API_KEY=your_key_here
   REACT_APP_YOUTUBE_REGION=IN
   ```

4. Start the app:

   ```sh
   npm start
   ```

## Scripts

- `npm start`: run the local dev server.
- `npm run build`: create a production build.
- `npm test -- --watchAll=false`: run the test suite once.

## Notes

- Do not commit API keys or local `.env` files.
- The current app still calls the YouTube Data API from the browser; the next architecture phase should move API access behind a backend-for-frontend proxy.
- Public YouTube API usage must follow YouTube API Services Terms and Developer Policies.
