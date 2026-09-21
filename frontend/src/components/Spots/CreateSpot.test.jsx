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

describe("CreateSpot photo links", () => {
  test("explains bad photo links on submit instead of saving", async () => {
    const { vi } = await import("vitest");
    vi.spyOn(window, "alert").mockImplementation(() => {});
    const fetchSpy = vi.spyOn(window, "fetch");
    renderApp(<CreateSpot />, { path: "/spots", user: DEMO_USER });
    await userEvent.type(screen.getByLabelText("Preview image URL"), "https://example.com/page.html");
    await userEvent.type(screen.getByLabelText("Additional image URL 2"), "not a link");
    await userEvent.click(screen.getByRole("button", { name: "Create Spot" }));
    expect(screen.getAllByText(/must start with http\(s\):\/\//)).toHaveLength(2);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
