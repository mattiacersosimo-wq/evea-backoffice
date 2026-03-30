import { clearSession, getSession, setSession } from "src/utils/jwt";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
});

describe("getSession", () => {
  it("returns false when no token", () => {
    expect(getSession()).toBe(false);
  });

  it("returns true when token exists", () => {
    localStorage.setItem("accessToken", "some-token");
    expect(getSession()).toBe(true);
  });
});

describe("setSession", () => {
  it("stores token in localStorage", () => {
    setSession("test-token");
    expect(localStorage.getItem("accessToken")).toBe("test-token");
  });

  it("removes token when null", () => {
    localStorage.setItem("accessToken", "old-token");
    setSession(null);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});

describe("clearSession", () => {
  it("removes all session data", () => {
    localStorage.setItem("accessToken", "token");
    localStorage.setItem("menu", "menu-data");
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("isSubAdmin", "false");

    clearSession();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("menu")).toBeNull();
    expect(localStorage.getItem("isAdmin")).toBeNull();
    expect(localStorage.getItem("isSubAdmin")).toBeNull();
  });
});
