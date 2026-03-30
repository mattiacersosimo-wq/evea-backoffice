import { PAYOUT_TYPE_IDS } from "src/utils/types";
import getPayoutNameFromId from "src/utils/get-payout-name-from-id";

describe("PAYOUT_TYPE_IDS", () => {
  it("has crypto type", () => {
    expect(PAYOUT_TYPE_IDS.crypto).toBeDefined();
  });
});

describe("getPayoutNameFromId", () => {
  it("returns a name for valid ID", () => {
    const name = getPayoutNameFromId(1);
    expect(typeof name).toBe("string");
  });
});
