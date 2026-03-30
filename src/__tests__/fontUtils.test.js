import { remToPx, pxToRem, responsiveFontSizes } from "src/utils/getFontValue";

describe("remToPx", () => {
  it("converts rem to px", () => {
    expect(remToPx("1rem")).toBe(16);
  });

  it("converts 2rem to 32px", () => {
    expect(remToPx("2rem")).toBe(32);
  });
});

describe("pxToRem", () => {
  it("converts 16px to 1rem", () => {
    expect(pxToRem(16)).toBe("1rem");
  });

  it("converts 32px to 2rem", () => {
    expect(pxToRem(32)).toBe("2rem");
  });
});

describe("responsiveFontSizes", () => {
  it("returns responsive styles object", () => {
    const result = responsiveFontSizes({ sm: 14, md: 16, lg: 18 });
    expect(result).toHaveProperty("@media (min-width:600px)");
    expect(result).toHaveProperty("@media (min-width:900px)");
    expect(result).toHaveProperty("@media (min-width:1200px)");
  });
});
