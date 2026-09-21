import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteSpot from "./DeleteSpot";
import DeleteReview from "../Reviews/DeleteReview";
import { renderApp, mockFetch, DEMO_USER } from "../../test/utils";

describe("delete dialogs", () => {
  test("a failed spot delete shows an error and keeps the buttons usable", async () => {
    mockFetch({ "DELETE /api/spots/5": [500, { message: "Server Error" }] });
    renderApp(<DeleteSpot spot={{ id: 5 }} />, { user: DEMO_USER });
    await userEvent.click(screen.getByRole("button", { name: "Yes (Delete Spot)" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't delete this spot");
    expect(screen.getByRole("button", { name: "Yes (Delete Spot)" })).toBeEnabled();
  });

  test("a successful spot delete refreshes the owner's spots", async () => {
    const calls = mockFetch({
      "DELETE /api/spots/5": [200, { message: "Successfully deleted" }],
      "GET /api/spots/current": [200, { Spots: [] }],
    });
    renderApp(<DeleteSpot spot={{ id: 5 }} />, { user: DEMO_USER });
    await userEvent.click(screen.getByRole("button", { name: "Yes (Delete Spot)" }));
    await screen.findByText("Other page", {}, { timeout: 50 }).catch(() => {});
    expect(calls.map((c) => c.key)).toEqual(["DELETE /api/spots/5", "GET /api/spots/current"]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("a failed review delete shows an error", async () => {
    mockFetch({ "DELETE /api/reviews/9": [403, { message: "Forbidden" }] });
    renderApp(<DeleteReview review={{ id: 9, spotId: 2 }} />, { user: DEMO_USER });
    await userEvent.click(screen.getByRole("button", { name: "Yes (Delete Review)" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't delete this review");
  });
});
