import { Divider, Stack, Typography } from "@mui/material";
import _ from "lodash";

const data = {
  businessBuilder: ["8% Direct Referral Bonus + FOB"],
  bronzeExecutive: [
    "9% Direct Referral Bonus + FOB",
    "$20 Bronze Achievement Bonus",
    "40% Business Builder Bonus",
    "10% Team Bonus",
  ],
  silverExecutive: [
    "10% Direct Referral Bonus + FOB",
    "$20 Bronze Achievement Bonus",
    "40% Business Builder Bonus",
    "10% Team Bonus",
  ],
  goldExecutive: [
    "10% Direct Referral Bonus + FOB",
    "$20 Bronze Achievement Bonus",
    "40% Business Builder Bonus",
    "11% Team Bonus",
  ],
  emeraldExecutive: [
    "10% Direct Referral Bonus + FOB",
    "$20 Bronze Achievement Bonus",
    "40% Business Builder Bonus",
    "12% Team Bonus",
  ],
};

const Items = ({ selected }) => (
  <Stack spacing={1}>
    {data[_.camelCase(selected)].map((item) => (
      <>
        <Typography>{item}</Typography>
        <Divider />
      </>
    ))}
  </Stack>
);

export default Items;
