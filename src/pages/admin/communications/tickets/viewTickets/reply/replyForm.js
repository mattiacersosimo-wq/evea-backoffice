import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import Iconify from "src/components/Iconify";
import {
  FormProvider,
  RHFEditor,
  RHFTextField,
} from "src/components/hook-form";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { handleErrors } from "src/pages/admin/settings/brand/getStarted/articles/utils";
import axiosInstance from "src/utils/axios";
import * as Yup from "yup";
import useGetCannedResponse from "../hook/useGetCannedResponse";
import useGetFaqs from "../hook/useGetFaqs";

const Validator = Yup.object().shape({
  title: Yup.string().required("errors.help_center.reply_form.title.required"),
  body: Yup.string().required("errors.help_center.reply_form.body.required"),
});

const defaultValues = {
  title: "",
  body: "",
  support_ticket_id: "",
  user_id: "",
  ticket_id: "",
};

const ReplyForm = ({ ticketData, fetchTicket, showReplyTicket }) => {
  const cannedResponse = useGetCannedResponse();
  const faqList = useGetFaqs();
  const { id } = useParams();

  const { ticket_number: ticketId, user_id, subject } = ticketData;

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(Validator),
  });

  const { setValue, reset } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const [test, setTest] = useState({ canned: "", question: "" });

  const onSubmit = methods.handleSubmit(async (inputData) => {
    const reqData = new FormData();
    Object.entries(inputData).forEach(([k, v]) => reqData.set(k, v));

    try {
      const { status, data } = await axiosInstance.post(
        "/api/admin/support-ticket-replies",
        reqData
      );
      if (status === 200) {
        fetchTicket();
        enqueueSnackbar(data.message);
        reset({ ...inputData, body: "", title: "" });
        setTest({ canned: "", question: "" });
      }
    } catch (err) {
      handleErrors(err);
    }
  });
  useEffect(() => {
    if (subject) {
      setValue("title", subject);
      setValue("support_ticket_id", id);
      setValue("user_id", user_id);
      setValue("ticket_id", ticketId);
    }
  }, [methods, subject, id, user_id, ticketId]);

  const { canned, question } = test;

  const onChange = (e) => {
    const { value } = e.target;
    const test = cannedResponse.find(({ id }) => id === parseInt(value));
    const { message } = test;
    setValue("body", message);
    setTest({ canned: value, question: "" });
  };

  const handleQuestion = (e) => {
    const { value } = e.target;
    const { answer } = faqList.find(({ id }) => id === parseInt(value)) || {};
    setValue("body", answer);
    setTest({ canned: "", question: value });
  };

  const { t } = useTranslation();

  return (
    <div>
      <Card>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Translate>help_center.view.reply_form.title</Translate>
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
              <TextField
                size="small"
                select
                fullWidth
                value={canned}
                SelectProps={{ native: true }}
                label={t("help_center.view.reply_form.response")}
                name="canned_response"
                onChange={onChange}
              >
                <option value="" />
                {cannedResponse?.map((item) => (
                  <option value={item.id}>{item.title}</option>
                ))}
              </TextField>

              <TextField
                size="small"
                select
                fullWidth
                value={question}
                SelectProps={{ native: true }}
                label={t("help_center.view.reply_form.questions")}
                onChange={handleQuestion}
              >
                <option value="" />
                {faqList?.map((item) => (
                  <option value={item.id}>{item.question}</option>
                ))}
              </TextField>

              <RHFTextField
                label={t("help_center.view.reply_form.name")}
                name="title"
              />
              {/* <Typography variant="caption" disable color="#a9a3a3" ml={1}>
                Variables You Can Use : @name | @username | @email | @ticketid
              </Typography> */}
              <RHFEditor name="body" label="Description" simple />
            </Box>
            <Ternary
              when={showReplyTicket}
              then={
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ mt: 2 }}
                  endIcon={
                    <Iconify icon={"ic:round-send"} width={24} height={24} />
                  }
                  name="post"
                >
                  <Translate>help_center.view.reply_form.submit</Translate>
                </Button>
              }
            />
          </FormProvider>
        </Stack>
      </Card>
    </div>
  );
};

export default ReplyForm;
