import stripNullFromObject from "src/utils/strip-null-from-object";

describe("stripNullFromObject", () => {
  it("removes null values", () => {
    const result = stripNullFromObject({ a: 1, b: null, c: "hello" });
    expect(result).toEqual({ a: 1, c: "hello" });
  });

  it("removes undefined values", () => {
    const result = stripNullFromObject({ a: 1, b: undefined });
    expect(result).toEqual({ a: 1 });
  });

  it("removes empty strings", () => {
    const result = stripNullFromObject({ a: 1, b: "" });
    expect(result).toEqual({ a: 1 });
  });

  it("keeps zero values", () => {
    const result = stripNullFromObject({ a: 0, b: 1 });
    expect(result.b).toBe(1);
  });

  it("handles empty object", () => {
    const result = stripNullFromObject({});
    expect(result).toEqual({});
  });
});
