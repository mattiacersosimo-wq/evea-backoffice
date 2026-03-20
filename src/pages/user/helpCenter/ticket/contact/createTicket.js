import { Box, Card, Divider, Grid, TextField, Typography } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import {
  FormProvider,
  RHFEditor,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import useCreateTicket from "./hooks/useCreateTicket";
import useFetchTicketsData from "./hooks/useFetchTicketsData";

const CreateTicket = () => {
  const departments = useFetchTicketsData("support-tickets-departments");
  const categories = useFetchTicketsData("support-tickets-categories");
  const priorities = useFetchTicketsData("support-tickets-priorities");
  const { methods, onSubmit } = useCreateTicket();

  const {
    register,
    formState: { isSubmitting, errors },
  } = methods;

  const { t } = useTranslation();
  return (
    <>
      <Card sx={{ pt: 2, pb: 4 }}>
        <Grid spacing={3}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" sx={{ pb: 2, pl: 2 }}>
              <Translate>
                support_tickets.contact_support.create_card.title
              </Translate>
            </Typography>
            <Divider />
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  marginTop: 2,
                  pl: 3,
                  pr: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                }}
              >
                <RHFSelect
                  name="department_id"
                  size="small"
                  label="support_tickets.contact_support.create_card.department"
                >
                  <option />
                  {departments.map((row) => (
                    <option value={row.id}>{row.name}</option>
                  ))}
                </RHFSelect>

                <RHFSelect
                  name="priority_id"
                  size="small"
                  label="support_tickets.contact_support.create_card.priority"
                >
                  <option />
                  {priorities?.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="category_id"
                  size="small"
                  label="support_tickets.contact_support.create_card.category"
                >
                  <option />
                  {categories?.map((row) => (
                    <option value={row.id}>{row.name}</option>
                  ))}
                </RHFSelect>
                <RHFTextField
                  size="small"
                  name="subject"
                  label="support_tickets.contact_support.create_card.subject"
                />
                <TextField
                  name="attachments_url"
                  size="small"
                  type="file"
                  label={t("support_tickets.contact_support.create_card.file")}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: ".jpeg, .png, .jpg" }}
                  {...register("attachments_url")}
                  error={Boolean(errors.attachments_url)}
                  helperText={errors.attachments_url?.message}
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  marginTop: 2,
                  pl: 3,
                  pr: 3,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(1, 1fr)",
                    md: "repeat(1, 66.5%)",
                  },
                }}
              >
                <RHFEditor
                  simple
                  multiline
                  fullWidth
                  rows={8}
                  name="description"
                />
              </Box>
              <Box sx={{ display: "flex", mt: 2, ml: 3 }}>
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  type="submit"
                  name="sent-request"
                >
                  <Translate>
                    support_tickets.contact_support.create_card.submit
                  </Translate>
                </LoadingButton>
              </Box>
            </FormProvider>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default CreateTicket;
