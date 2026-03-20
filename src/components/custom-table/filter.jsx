import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormProvider } from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Users from "src/components/users";

const defaultValues = {
  start_date: "",
  end_date: "",
  user_id: "",
};

const Filter = ({ setFilter }) => {
  const methods = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFilter(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
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
        <RHFDatePicker
          label={"adminFinancial.payout.pickStartDate"}
          name="start_date"
          size="small"
        />
        <RHFDatePicker
          label={"adminFinancial.payout.pickEndDate"}
          name="end_date"
          size="small"
        />
        <Users
          name="user_id"
          label={"adminStore.businessBuilder.userName"}
          size="small"
        />
        <Button type="submit" variant="contained" size="medium">
          Get Report
        </Button>
      </Box>
    </FormProvider>
  );
};

export default Filter;
