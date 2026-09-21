import { describe, test, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginFormModal from "./LoginFormModal";
import { renderApp, mockFetch, DEMO_USER } from "../../test/utils";

describe("LoginFormModal", () => {
  test("shows no messages until the user types, then explains the rule", async () => {
    renderApp(<LoginFormModal />);
    expect(screen.getByRole("button", { name: "Log In" })).toBeDisabled();
    expect(screen.queryByText(/4 characters or more/)).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Username or Email"), "ab");
    expect(screen.getByText("Username must be 4 characters or more")).toBeInTheDocument();
  });

  test("enables Log In once both fields are valid", async () => {
    renderApp(<LoginFormModal />);
    await userEvent.type(screen.getByLabelText("Username or Email"), "Demo-User");
    await userEvent.type(screen.getByLabelText("Password"), "password");
    expect(screen.getByRole("button", { name: "Log In" })).toBeEnabled();
  });

  test("demo login sends the demo credentials and stores the user", async () => {
    const calls = mockFetch({ "POST /api/session": [200, { user: DEMO_USER }] });
    const { store } = renderApp(<LoginFormModal />);
    await userEvent.click(screen.getByRole("button", { name: "Log in as Demo User" }));
    await waitFor(() => expect(store.getState().session.user).toEqual(DEMO_USER));
    expect(calls[0].body).toEqual({ credential: "Demo-User", password: "password" });
  });

  test("shows the server's message when login fails", async () => {
    mockFetch({ "POST /api/session": [401, { message: "The provided credentials were invalid" }] });
    renderApp(<LoginFormModal />);
    await userEvent.type(screen.getByLabelText("Username or Email"), "Demo-User");
    await userEvent.type(screen.getByLabelText("Password"), "wrong-password");
    await userEvent.click(screen.getByRole("button", { name: "Log In" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("The provided credentials were invalid");
  });
});
