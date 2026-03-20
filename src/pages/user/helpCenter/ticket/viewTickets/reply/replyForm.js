import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import fetchUser from "src/utils/fetchUser";
import * as Yup from "yup";

const schema = Yup.object().shape({
  body: Yup.string().required("errors.tickets.reply_form.body.required"),
  title: Yup.string().required("errors.tickets.reply_form.title.required"),
});

const defaultValues = {
  title: "",
  body: "",
};

const ReplyForm = ({ reload }) => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = methods.handleSubmit(async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.set(k, v));

    reqData.append("support_ticket_id", id);

    try {
      const { status, data } = await fetchUser.post(
        "support-ticket-replies",
        reqData
      );
      if (status === 200) {
        reload(id);
        enqueueSnackbar(data.message);
        methods.reset();
      }
    } catch (err) {
      console.error(err);
    }
  });
  return (
    <div>
      <Card>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="subtitle2">
            <Translate>support_tickets.view.reply_form.title</Translate>
          </Typography>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Box
              sx={{
                display: "grid",
                rowGap: 3,
                columnGap: 2,
                marginTop: 3,
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                },
              }}
            >
              <RHFTextField
                name="title"
                label="support_tickets.view.reply_form.faq_title"
              />
              <RHFEditor name="body" simple />
            </Box>
            <Button
              variant="contained"
              type="submit"
              endIcon={
                <Iconify icon={"ic:round-send"} width={24} height={24} />
              }
            >
              <Translate>support_tickets.view.reply_form.submit</Translate>
            </Button>
          </FormProvider>
        </Stack>
      </Card>
    </div>
  );
};

export default ReplyForm;
