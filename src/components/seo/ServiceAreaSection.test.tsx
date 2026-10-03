import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it } from "vitest";
import ServiceAreaSection from "./ServiceAreaSection";

afterEach(cleanup);
it("links known city pages and leaves unsupported locations as text", () => {
  render(<MemoryRouter><ServiceAreaSection cities={["Toronto", " Richmond   Hill ", "Ottawa"]} /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Toronto" })).toHaveAttribute("href", "/service-areas/toronto");
  expect(screen.getByRole("link", { name: "Richmond Hill" })).toHaveAttribute("href", "/service-areas/richmond-hill");
  expect(screen.getByText("Ottawa").closest("a")).toBeNull();
});
