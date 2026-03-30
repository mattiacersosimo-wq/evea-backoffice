import getPageForDelete from "src/utils/get-page-for-delete";

describe("getPageForDelete", () => {
  it("stays on same page when items remain", () => {
    expect(getPageForDelete(2, 5)).toBe(2);
  });

  it("goes to previous page when last item deleted", () => {
    expect(getPageForDelete(2, 1)).toBe(1);
  });

  it("goes to page 0 when last item on page 1", () => {
    expect(getPageForDelete(1, 1)).toBe(0);
  });

  it("stays on same page with multiple items", () => {
    expect(getPageForDelete(3, 10)).toBe(3);
  });
});
