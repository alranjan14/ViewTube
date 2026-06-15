import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./utils/store";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for testing
    },
  },
});

test("renders the app shell", () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  );
  expect(screen.getByRole("link", { name: /videotube home/i })).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /primary navigation/i })).toBeInTheDocument();
});
