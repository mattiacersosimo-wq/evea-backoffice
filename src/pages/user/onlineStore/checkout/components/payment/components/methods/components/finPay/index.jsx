import { Collapse, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import CardInfo from "src/components/finpayForm/components/cardInfo";
import PersonalInfo from "src/components/finpayForm/components/personalInfo";
import { TYPE_IDS } from "src/utils/types";

const FinPay = ({ recurringCheckbox = false, name }) => {
  const { watch } = useFormContext();
  const isFinPay = watch(name) === TYPE_IDS.finPay;

  return (
    <Collapse in={isFinPay}>
      <Stack spacing={2} sx={{ mb: 2.5 }}>
        <PersonalInfo />
        <CardInfo recurringCheckbox={recurringCheckbox} />
        {/* <Typography variant="caption">{finPayMessage}</Typography> */}
      </Stack>
    </Collapse>
  );
};

export default FinPay;
