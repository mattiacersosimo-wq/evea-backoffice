import { HOST_API, buildApiUrl, CURRENCY, DATE_FORMAT } from "src/config";

describe("config", () => {
  it("DATE_FORMAT is defined", () => {
    expect(DATE_FORMAT).toBe("DD MMM YYYY");
  });

  it("CURRENCY defaults to EUR or USD", () => {
    expect(["EUR", "USD"]).toContain(CURRENCY);
  });

  it("HOST_API is defined", () => {
    expect(HOST_API).toBeDefined();
  });
});

describe("buildApiUrl", () => {
  it("builds correct URL with path", () => {
    const url = buildApiUrl("api/user/profile");
    expect(url).toContain("api/user/profile");
  });

  it("returns HOST_API for empty path", () => {
    const url = buildApiUrl("");
    expect(url).toBe(HOST_API);
  });

  it("strips leading slashes from path", () => {
    const url = buildApiUrl("/api/test");
    expect(url).toContain("api/test");
    expect(url).not.toMatch(/[^:]\/\/api/);
  });
});
