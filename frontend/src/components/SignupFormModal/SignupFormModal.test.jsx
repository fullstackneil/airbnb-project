import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupFormModal from "./SignupFormModal";
import { renderApp } from "../../test/utils";

const fill = async (values) => {
  for (const [label, value] of Object.entries(values)) {
    await userEvent.type(screen.getByLabelText(label), value);
  }
};

describe("SignupFormModal", () => {
  test("stays disabled until every field has a value", async () => {
    renderApp(<SignupFormModal />);
    const button = screen.getByRole("button", { name: "Sign Up" });
    expect(button).toBeDisabled();
    await fill({ "First Name": "Obi", "Last Name": "Kenobi", Email: "obi@jedi.org", Username: "obiwan", Password: "secret1" });
    expect(button).toBeDisabled();
    await fill({ "Confirm Password": "secret1" });
    expect(button).toBeEnabled();
  });

  test("explains every problem on submit and doesn't call the server", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");
    renderApp(<SignupFormModal />);
    await fill({
      "First Name": "Al", "Last Name": "Kenobi", Email: "not-an-email",
      Username: "obi@jedi.org", Password: "12345", "Confirm Password": "12346",
    });
    await userEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    const messages = screen.getAllByRole("alert").map((el) => el.textContent);
    expect(messages).toEqual([
      "First name must be 3 characters or more",
      "Please provide a valid email",
      "Username cannot be an email",
      "Password must be 6 characters or more",
      "Confirm Password field must be the same as the Password field",
    ]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
