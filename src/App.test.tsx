import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { test, expect } from "vitest";
import App from "./App";
import store from "./utils/store";

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
