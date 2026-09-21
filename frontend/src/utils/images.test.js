import { describe, test, expect } from "vitest";
import { sizedImage, fallbackToOriginal } from "./images";

const CLOUDINARY = "https://res.cloudinary.com/demo/image/upload/v1/photo.jpg";

describe("sizedImage", () => {
  test("adds resize and auto-format options to Cloudinary URLs", () => {
    expect(sizedImage(CLOUDINARY, 800)).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v1/photo.jpg"
    );
  });
  test("leaves other hosts and missing values alone", () => {
    expect(sizedImage("https://example.com/a.jpg", 800)).toBe("https://example.com/a.jpg");
    expect(sizedImage(undefined, 800)).toBeUndefined();
  });
});

describe("fallbackToOriginal", () => {
  test("swaps a failed resized image back to the original once", () => {
    const img = document.createElement("img");
    img.src = sizedImage(CLOUDINARY, 800);
    const onError = fallbackToOriginal(CLOUDINARY);
    onError({ currentTarget: img });
    expect(img.src).toBe(CLOUDINARY);
    onError({ currentTarget: img });
    expect(img.src).toBe(CLOUDINARY);
  });
});
