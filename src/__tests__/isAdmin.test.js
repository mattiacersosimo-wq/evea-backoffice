import isAdmin from "src/utils/isAdmin";
import isSubAdmin from "src/utils/is-sub-admin";

describe("isAdmin", () => {
  beforeEach(() => localStorage.clear());

  it("returns true when isAdmin is true", () => {
    localStorage.setItem("isAdmin", "true");
    expect(isAdmin()).toBe(true);
  });

  it("returns false when isAdmin is false", () => {
    localStorage.setItem("isAdmin", "false");
    expect(isAdmin()).toBe(false);
  });

  it("returns false when not set", () => {
    expect(isAdmin()).toBeFalsy();
  });
});

describe("isSubAdmin", () => {
  beforeEach(() => localStorage.clear());

  it("returns true when isSubAdmin is true", () => {
    localStorage.setItem("isSubAdmin", "true");
    expect(isSubAdmin()).toBe(true);
  });

  it("returns false when not set", () => {
    expect(isSubAdmin()).toBeFalsy();
  });
});
