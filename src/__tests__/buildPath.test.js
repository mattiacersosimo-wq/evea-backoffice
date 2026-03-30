import buildPath from "src/utils/build-path";

describe("buildPath", () => {
  it("joins two segments", () => {
    expect(buildPath("/api/admin", "users")).toBe("/api/admin/users");
  });

  it("joins multiple segments", () => {
    expect(buildPath("/api", "admin", "users", "1")).toBe("/api/admin/users/1");
  });

  it("handles single segment", () => {
    expect(buildPath("/api")).toBe("/api");
  });
});
