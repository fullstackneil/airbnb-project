import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "./Navigation";
import { renderApp, DEMO_USER } from "../../test/utils";

describe("Navigation menu", () => {
  test("toggle opens and closes the menu", async () => {
    renderApp(<Navigation />);
    const toggle = screen.getByRole("button", { name: "Open user menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.queryByRole("button", { name: "Log In" })).not.toBeInTheDocument();
  });

  test("Escape and outside clicks close the menu", async () => {
    renderApp(<Navigation />);
    const toggle = screen.getByRole("button", { name: "Open user menu" });
    await userEvent.click(toggle);
    await userEvent.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    await userEvent.click(document.body);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("opening Log In closes the menu and shows a single modal", async () => {
    renderApp(<Navigation />);
    await userEvent.click(screen.getByRole("button", { name: "Open user menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Log In" }));
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Sign Up" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Username or Email")).toHaveFocus();
  });

  test("logged-in users see their details and Create a New Spot", async () => {
    renderApp(<Navigation />, { user: DEMO_USER });
    expect(screen.getByRole("link", { name: "Create a New Spot" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open user menu" }));
    expect(screen.getByText("Hello, Demo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Manage Spots" })).toHaveAttribute("href", "/spots/myspots");
  });
});
