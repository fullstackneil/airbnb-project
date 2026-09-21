import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateReview from "./CreateReview";
import { renderApp, DEMO_USER } from "../../test/utils";

describe("CreateReview star rating", () => {
  test("stars are a labelled radio group and enable submit with a review", async () => {
    renderApp(<CreateReview spot={{ id: 2 }} />, { user: DEMO_USER });
    const submit = screen.getByRole("button", { name: "Submit Your Review" });
    expect(submit).toBeDisabled();

    const group = screen.getByRole("radiogroup", { name: "Stars:" });
    expect(group).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText("Leave your review here..."), "Freezing but cozy!");
    await userEvent.click(screen.getByRole("radio", { name: "4 stars" }));

    expect(screen.getByRole("radio", { name: "4 stars" })).toHaveAttribute("aria-checked", "true");
    expect(submit).toBeEnabled();
  });

  test("stars can be chosen with the keyboard", async () => {
    renderApp(<CreateReview spot={{ id: 2 }} />, { user: DEMO_USER });
    screen.getByRole("radio", { name: "3 stars" }).focus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("radio", { name: "3 stars" })).toHaveAttribute("aria-checked", "true");
  });
});
