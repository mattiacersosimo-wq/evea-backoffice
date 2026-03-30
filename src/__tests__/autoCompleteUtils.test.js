import { getSingle, getMultiple } from "src/components/auto-complete/utils/get";
import { extractSingle, extractMultiple } from "src/components/auto-complete/utils/extract";

const options = [
  { id: 1, name: "Opzione 1" },
  { id: 2, name: "Opzione 2" },
  { id: 3, name: "Opzione 3" },
];

describe("getSingle", () => {
  it("finds option by id", () => {
    expect(getSingle(options, 2)).toEqual({ id: 2, name: "Opzione 2" });
  });

  it("returns null for missing id", () => {
    expect(getSingle(options, 99)).toBeNull();
  });
});

describe("getMultiple", () => {
  it("finds multiple options by ids", () => {
    const result = getMultiple(options, [1, 3]);
    expect(result).toHaveLength(2);
  });
});

describe("extractSingle", () => {
  it("extracts id from object", () => {
    expect(extractSingle({ id: 5, name: "Test" })).toBe(5);
  });

  it("returns null for falsy value", () => {
    expect(extractSingle(null)).toBeNull();
  });
});

describe("extractMultiple", () => {
  it("extracts ids from array of objects", () => {
    const result = extractMultiple([{ id: 1 }, { id: 2 }]);
    expect(result).toEqual([1, 2]);
  });

  it("returns empty array for null", () => {
    expect(extractMultiple(null)).toEqual([]);
  });
});
