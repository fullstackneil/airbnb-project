import { describe, test, expect } from "vitest";
import {
  COORDINATE_INPUT,
  PRICE_INPUT,
  validateCoordinates,
  validatePrice,
  validateName,
  toCoordinate,
} from "./spotValidation";

describe("input filters", () => {
  test.each(["", "-", "12", "-33.", "-33.87", "151.2"])("coordinate filter allows %j while typing", (v) => {
    expect(COORDINATE_INPUT.test(v)).toBe(true);
  });
  test.each(["abc", "1-2", "1.2.3", "--1"])("coordinate filter rejects %j", (v) => {
    expect(COORDINATE_INPUT.test(v)).toBe(false);
  });
  test("price filter allows up to two decimals", () => {
    expect(PRICE_INPUT.test("99.99")).toBe(true);
    expect(PRICE_INPUT.test("99.999")).toBe(false);
    expect(PRICE_INPUT.test("-5")).toBe(false);
  });
});

describe("validateCoordinates", () => {
  test("blank coordinates are optional", () => {
    expect(validateCoordinates("", "")).toEqual({});
    expect(validateCoordinates(null, undefined)).toEqual({});
  });
  test("zero is a valid coordinate", () => {
    expect(validateCoordinates(0, "0")).toEqual({});
  });
  test("out-of-range and partial values are errors", () => {
    expect(validateCoordinates("91", "-181")).toEqual({
      lat: "Latitude must be between -90 and 90",
      lng: "Longitude must be between -180 and 180",
    });
    expect(validateCoordinates("-", "12.")).toEqual({ lat: "Latitude must be a number" });
  });
});

describe("validatePrice / validateName", () => {
  test("price must be a positive number", () => {
    expect(validatePrice("99.99")).toEqual({});
    expect(validatePrice("0")).toHaveProperty("price");
    expect(validatePrice("")).toHaveProperty("price");
  });
  test("name matches the server's 49-character limit", () => {
    expect(validateName("x".repeat(49))).toEqual({});
    expect(validateName("x".repeat(50))).toEqual({ name: "Name must be less than 50 characters" });
    expect(validateName("   ")).toEqual({ name: "Name is required" });
  });
  test("toCoordinate sends blanks as null", () => {
    expect(toCoordinate("")).toBeNull();
    expect(toCoordinate("-33.87")).toBe(-33.87);
    expect(toCoordinate(0)).toBe(0);
  });
});
