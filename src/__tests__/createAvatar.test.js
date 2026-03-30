import createAvatar from "src/utils/createAvatar";

describe("createAvatar", () => {
  it("returns first character of name", () => {
    const avatar = createAvatar("Mario Rossi");
    expect(avatar.name).toBe("M");
  });

  it("returns a color", () => {
    const avatar = createAvatar("Luigi");
    expect(avatar.color).toBeDefined();
  });

  it("handles empty name", () => {
    const avatar = createAvatar("");
    expect(avatar).toBeDefined();
  });

  it("handles single character", () => {
    const avatar = createAvatar("A");
    expect(avatar.name).toBe("A");
  });
});
