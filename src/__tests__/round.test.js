import { twoPlaceRound } from "src/utils/round";

describe("twoPlaceRound", () => {
  it("rounds to 2 decimal places", () => {
    expect(twoPlaceRound(3.14159)).toBe(3.14);
  });

  it("rounds up correctly", () => {
    expect(twoPlaceRound(9.999)).toBe(10);
  });

  it("handles negative numbers", () => {
    expect(twoPlaceRound(-3.14159)).toBe(-3.14);
  });

  it("handles zero", () => {
    expect(twoPlaceRound(0)).toBe(0);
  });

  it("handles NaN", () => {
    expect(twoPlaceRound(NaN)).toBe(0);
  });

  it("handles no argument", () => {
    expect(twoPlaceRound()).toBe(0);
  });
});
