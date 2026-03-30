import { escapeHtml } from "src/utils/safeHtml";

describe("escapeHtml", () => {
  it("escapes HTML tags", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
    );
  });

  it("escapes quotes", () => {
    expect(escapeHtml('"hello" & \'world\'')).toBe(
      "&quot;hello&quot; &amp; &#039;world&#039;"
    );
  });

  it("returns empty string for null", () => {
    expect(escapeHtml(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(escapeHtml(undefined)).toBe("");
  });

  it("handles numbers", () => {
    expect(escapeHtml(123)).toBe("123");
  });

  it("passes normal text through", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});
