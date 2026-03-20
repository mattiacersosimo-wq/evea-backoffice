import { Box, Button } from "@mui/material";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";

import Translate from "src/components/translate";
import PaymentTypes from "./components/paymentTypes";
import useFilter from "./hooks/useFilter";

const Filter = ({ onFilter }) => {
  const { methods, onSubmit } = useFilter(onFilter);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1,1fr)",
            sm: "repeat(4, 1fr)",
          },
          rowGap: 3,
          columnGap: 3,
          marginBottom: "2rem",
        }}
      >
        <RHFDatePicker label="date.start" name="start_date" size="small" />
        <RHFDatePicker label="date.end" name="end_date" size="small" />

        <PaymentTypes />

        <Button
          type="submit"
          variant="contained"
          size="medium"
          name="get-report"
        >
          <Translate>report.get</Translate>
        </Button>
      </Box>
    </FormProvider>
  );
};

export default Filter;
