import objectToQueryString from "src/utils/object-to-query-string";

describe("objectToQueryString", () => {
  it("converts object to query string", () => {
    const result = objectToQueryString({ page: 1, limit: 10 });
    expect(result).toContain("page=1");
    expect(result).toContain("limit=10");
  });

  it("handles empty object", () => {
    const result = objectToQueryString({});
    expect(result).toBe("");
  });

  it("includes null as empty string (URLSearchParams behavior)", () => {
    const result = objectToQueryString({ page: 1, filter: null });
    expect(result).toContain("page=1");
  });
});
