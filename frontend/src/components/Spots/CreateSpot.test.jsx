import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSpot from "./CreateSpot";
import { renderApp, DEMO_USER } from "../../test/utils";

describe("CreateSpot", () => {
  test("logged-out visitors are redirected away", () => {
    renderApp(<CreateSpot />, { path: "/spots" });
    expect(screen.getByText("Other page")).toBeInTheDocument();
  });

  test("coordinate and price fields accept negatives and decimals but not letters", async () => {
    renderApp(<CreateSpot />, { path: "/spots", user: DEMO_USER });
    const lat = screen.getByPlaceholderText("Latitude (optional)");
    const price = screen.getByPlaceholderText("Price per night (USD)");
    await userEvent.type(lat, "-33.87");
    await userEvent.type(price, "99.999abc");
    expect(lat).toHaveValue("-33.87");
    expect(price).toHaveValue("99.99");
  });
});
