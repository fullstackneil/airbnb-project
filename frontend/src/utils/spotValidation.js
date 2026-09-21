// Shared input filters and checks for the Create and Update Spot forms.

// Allow partial numbers while typing, e.g. "-", "12.", "-33.8".
export const COORDINATE_INPUT = /^-?\d*\.?\d*$/;
// Dollars with up to two decimal places.
export const PRICE_INPUT = /^\d*\.?\d{0,2}$/;

const isNumber = (value) => value !== "" && !isNaN(Number(value));

export function validateCoordinates(lat, lng) {
  const errors = {};
  const latStr = String(lat ?? "").trim();
  const lngStr = String(lng ?? "").trim();

  if (latStr) {
    if (!isNumber(latStr)) errors.lat = "Latitude must be a number";
    else if (Number(latStr) < -90 || Number(latStr) > 90) errors.lat = "Latitude must be between -90 and 90";
  }
  if (lngStr) {
    if (!isNumber(lngStr)) errors.lng = "Longitude must be a number";
    else if (Number(lngStr) < -180 || Number(lngStr) > 180) errors.lng = "Longitude must be between -180 and 180";
  }
  return errors;
}

export function validatePrice(price) {
  const priceStr = String(price ?? "").trim();
  if (!isNumber(priceStr) || Number(priceStr) <= 0) {
    return { price: "Price is required and must be greater than 0" };
  }
  return {};
}

// Optional coordinates are sent as null when left blank.
export const toCoordinate = (value) =>
  String(value ?? "").trim() === "" ? null : parseFloat(value);

// Turn a failed save response into a message a user can act on.
export async function describeSpotSaveError(res, action) {
  const data = await res?.json?.().catch(() => null);
  const fieldErrors = data?.errors || {};

  if (String(fieldErrors.address || "").includes("unique")) {
    return "Another spot already uses this street address. Please enter a different address.";
  }
  const messages = Object.values(fieldErrors).filter(Boolean);
  if (messages.length > 0) return `Couldn't ${action} your spot: ${messages.join(". ")}`;
  return `Couldn't ${action} your spot. Please try again.`;
}
