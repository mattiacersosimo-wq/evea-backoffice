import parseDate from "src/lib/parseDate";
import serializeDate from "src/utils/serialize-date";
import convertDMYToMDY, { convertMDYToDMY } from "src/utils/convertDMYToMDY";
import { getClientTime } from "src/utils/dateTime";

describe("parseDate", () => {
  it("formats a valid date", () => {
    expect(parseDate("2026-03-30")).toBe("30 Mar 2026");
  });

  it("returns dash for null", () => {
    expect(parseDate(null)).toBe("-");
  });

  it("returns dash for undefined", () => {
    expect(parseDate(undefined)).toBe("-");
  });

  it("returns dash for empty string", () => {
    expect(parseDate("")).toBe("-");
  });
});

describe("serializeDate", () => {
  it("formats a date to YYYY/MM/DD", () => {
    const result = serializeDate("2026-03-30");
    expect(result).toBe("2026/03/30");
  });

  it("returns null for null input", () => {
    expect(serializeDate(null)).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(serializeDate()).toBeNull();
  });
});

describe("convertDMYToMDY", () => {
  it("converts DD/MM/YYYY to MM/DD/YYYY", () => {
    expect(convertDMYToMDY("30/03/2026")).toBe("03/30/2026");
  });

  it("returns null for empty string", () => {
    expect(convertDMYToMDY("")).toBeNull();
  });
});

describe("convertMDYToDMY", () => {
  it("converts MM/DD/YYYY to DD/MM/YYYY", () => {
    expect(convertMDYToDMY("03/30/2026")).toBe("30/03/2026");
  });

  it("returns null for empty string", () => {
    expect(convertMDYToDMY("")).toBeNull();
  });
});

describe("getClientTime", () => {
  it("returns formatted time with timezone", () => {
    const result = getClientTime("2026-03-30T10:00:00");
    expect(result).toContain("30 Mar 2026 10:00");
    expect(result).toContain("/");
  });

  it("returns null for null input", () => {
    expect(getClientTime(null)).toBeNull();
  });
});
