import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";

test("renders the app shell", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: /videotube home/i })).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /primary navigation/i })).toBeInTheDocument();
});
