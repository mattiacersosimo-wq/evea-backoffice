import { fCurrency, fPercent, fNumber, fShortenNumber, fData } from "src/utils/formatNumber";

describe("fCurrency", () => {
  it("formats number as currency", () => {
    const result = fCurrency(1234.56);
    expect(result).toBeDefined();
  });

  it("handles zero", () => {
    const result = fCurrency(0);
    expect(result).toBeDefined();
  });
});

describe("fPercent", () => {
  it("formats number as percentage", () => {
    const result = fPercent(75.5);
    expect(result).toContain("%");
  });
});

describe("fNumber", () => {
  it("formats a number", () => {
    const result = fNumber(1234);
    expect(result).toBeDefined();
  });
});

describe("fShortenNumber", () => {
  it("shortens large numbers", () => {
    const result = fShortenNumber(1234567);
    expect(result).toBeDefined();
  });

  it("handles small numbers", () => {
    const result = fShortenNumber(100);
    expect(result).toBeDefined();
  });
});

describe("fData", () => {
  it("formats data size", () => {
    const result = fData(1024);
    expect(result).toBeDefined();
  });
});
