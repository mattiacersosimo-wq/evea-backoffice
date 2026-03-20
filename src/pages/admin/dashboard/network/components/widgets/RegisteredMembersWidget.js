import { Box, Card, CardHeader, Typography } from "@mui/material";

import MembersWidget from "./MembersWidget";
import Translate from "src/components/translate";
import { useTranslation } from "react-i18next";

export default function RegisteredMembersWidget({ data }) {
  const { members, holding_tank, network_members, business_builder_members } =
    data;

  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader
        title={
          <>
            <Typography
              variant="subtitle2"
              paragraph
              sx={{ color: "text.secondary", marginBottom: 0 }}
            >
              <Translate>network.registeredMembers</Translate>
            </Typography>
          </>
        }
        subheader={
          <>
            <Typography variant="h5">{members}</Typography>
          </>
        }
      />

      <Box
        sx={{
          display: "grid",
          rowGap: 2,
          columnGap: 2,
          padding: 2,
          marginTop: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <Box>
          <MembersWidget
            title={t("network.holdingTank")}
            count={holding_tank}
            color="warning"
          />
        </Box>
        <Box>
          <MembersWidget
            title={t("network.networkMembers")}
            count={network_members}
            color="secondary"
          />
        </Box>

        <Box>
          <MembersWidget
            title={t("network.businessBuilder")}
            count={business_builder_members}
            color="primary"
          />
        </Box>
      </Box>
    </Card>
  );
}
