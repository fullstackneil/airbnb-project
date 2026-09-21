import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";
import SpotDetailsPage from "./SpotDetailsPage";
import { renderApp, mockFetch } from "../../test/utils";

const IMG = "https://res.cloudinary.com/demo/image/upload/v1/photo.jpg";
const spotWith = (count) => ({
  id: 7, name: "Hoth Rebel Base", city: "Echo Base", state: "Hoth", country: "Outer Rim",
  price: 150, ownerId: 99, description: "Cold.", Owner: { firstName: "Leia", lastName: "Organa" },
  SpotImages: Array.from({ length: count }, (_, i) => ({ id: i + 1, url: IMG, preview: i === 0 })),
});

const renderSpot = () => renderApp(<SpotDetailsPage />, { path: "/spots/7", routePath: "/spots/:spotId" });

describe("SpotDetailsPage", () => {
  test.each([1, 3, 4, 5])("uses the %i-photo gallery layout with resized images", async (count) => {
    mockFetch({
      "GET /api/spots/7": [200, spotWith(count)],
      "GET /api/spots/7/reviews": [200, { Reviews: [] }],
    });
    renderSpot();
    const title = await screen.findByRole("heading", { name: "Hoth Rebel Base" });
    expect(title).toBeInTheDocument();
    const gallery = document.querySelector(".spot-images-container");
    expect(gallery).toHaveClass(`gallery-count-${count}`);
    const images = screen.getAllByRole("img", { name: /Hoth Rebel Base/ });
    expect(images).toHaveLength(count);
    expect(images[0].src).toContain("f_auto,q_auto,w_1600");
  });

  test("shows a not-found message instead of loading forever", async () => {
    mockFetch({ "GET /api/spots/7": [404, { message: "Spot couldn't be found" }] });
    renderSpot();
    expect(await screen.findByText(/couldn't find that spot/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse all spots" })).toHaveAttribute("href", "/");
  });
});
