import { Box, Stack } from "@mui/material";
import PropTypes from "prop-types";
import { useSubscriptionContext } from "../../store/subscription";
import "../card/style.css";
import ActionButton from "./actionButton";
import DisableRecurring from "./components/buttons/disable-recurring";
import EnableRecurring from "./components/buttons/enable-recurring";
import DateRange from "./components/date-range";
import Name from "./components/name";
import UpdatePayment from "./components/update-payment";

const Content = ({ fetchData }) => {
  const data = useSubscriptionContext();

  const { product_id, purchase_product, wp_purchase } = data;
  const { name } = purchase_product || {};

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Name />
            <DateRange />
          </Box>
        </Box>

        {!Boolean(Number(wp_purchase)) && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 1,
              mb: 1,
            }}
          >
            <EnableRecurring reload={fetchData} />
            <DisableRecurring reload={fetchData} />
            <UpdatePayment reload={fetchData} />
          </Stack>
        )}

        <Box
          sx={{
            alignItem: "center",
            justifyContent: "space-between",
            display: { xs: "none", sm: "block", md: "block" },
          }}
        >
          {/* <ActionButton product_id={product_id} name={name} /> */}
        </Box>
      </Box>
    </>
  );
};

Content.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  isActive: PropTypes.string.isRequired,
  body: PropTypes.bool.isRequired,
};

export default Content;
