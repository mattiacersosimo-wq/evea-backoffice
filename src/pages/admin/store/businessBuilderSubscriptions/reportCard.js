import { Grid } from "@mui/material";
import { BookingIllustration } from "src/assets";

import SingleCard from "./singleCard";
import { useTranslation } from "react-i18next";

const ReportCard = ({ data }) => {
  const { recurringCancelledCount, recurringCount, totalAmount, thisWeek } =
    data;
  const { t } = useTranslation();
  return (
    <>
      <Grid item xs={12} md={8}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <SingleCard
              title={t("businessBuilder.totalAmount")}
              total={totalAmount}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <SingleCard
              title={t("businessBuilder.recurringEnabled")}
              total={recurringCancelledCount}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <SingleCard
              title={t("businessBuilder.recurringCancelled")}
              total={recurringCount}
              icon={<BookingIllustration />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SingleCard
              title={t("businessBuilder.thisWeekEnd")}
              total={thisWeek}
              icon={<BookingIllustration />}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportCard;
