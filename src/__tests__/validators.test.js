import { isValidString, isValidNumber } from "src/utils/validators";

describe("isValidString", () => {
  it("accepts letters only", () => {
    expect(isValidString("Hello")).toBe(true);
  });

  it("accepts letters with spaces", () => {
    expect(isValidString("Hello World")).toBe(true);
  });

  it("rejects numbers", () => {
    expect(isValidString("Hello123")).toBe(false);
  });

  it("rejects special characters", () => {
    expect(isValidString("Hello!@#")).toBe(false);
  });

  it("accepts empty string (allows typing)", () => {
    expect(isValidString("")).toBe(true);
  });
});

describe("isValidNumber", () => {
  it("accepts digits only", () => {
    expect(isValidNumber("12345")).toBe(true);
  });

  it("rejects letters", () => {
    expect(isValidNumber("123abc")).toBe(false);
  });

  it("rejects special characters", () => {
    expect(isValidNumber("123.45")).toBe(false);
  });

  it("accepts empty string (allows typing)", () => {
    expect(isValidNumber("")).toBe(true);
  });
});
