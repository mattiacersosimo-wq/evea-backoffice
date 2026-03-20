import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { capitalCase } from "change-case";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RHFTextField } from "src/components/hook-form";
import Translate from "src/components/translate";
import useFetchTicketsData from "../../ticket/contact/hooks/useFetchTicketsData";

const statusList = [
  { name: "all" },
  { name: "open" },
  { name: "resolved" },
  { name: "closed" },
  // { name: "archived" },
  // { name: "deleted" },
  // { name: "unverified" },
  // { name: "request_approval" },
  { name: "in_progress" },
  { name: "responded" },
];
const Filter = () => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 3,
          m: 2,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        <Departments />
        <Priority />

        <Status />
        <Category />

        <RHFTextField label="search.ticket" name="ticket_number" size="small" />

        <Button
          type="submit"
          size="small"
          variant="contained"
          name="get-report"
          sx={{ pt: 1, pb: 1 }}
        >
          <Translate>report.get</Translate>
        </Button>
      </Box>
    </>
  );
};

const Status = () => {
  const { watch, setValue } = useFormContext();
  const status = watch("status");
  const selected = statusList.find((item) => item === status);
  const { t } = useTranslation();

  return (
    <Autocomplete
      onChange={(_, v) =>
        setValue("status", v ? (v.name === "all" ? null : v.name) : null)
      }
      value={selected}
      options={statusList}
      getOptionLabel={(option) => capitalCase(option.name)}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={t("search.status")}
        />
      )}
    />
  );
};

const Departments = () => {
  const departments = useFetchTicketsData("support-tickets-departments");
  const { watch, setValue } = useFormContext();
  const departmentId = watch("department_id");
  const selected = departments.find(({ id }) => id === departmentId);
  const { t } = useTranslation();
  return (
    <Autocomplete
      onChange={(_, v) => setValue("department_id", v ? v.id : null)}
      value={selected}
      options={departments}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={t("search.department")}
          name="departments"
        />
      )}
    />
  );
};

const Category = () => {
  const categories = useFetchTicketsData("support-tickets-categories");
  const { watch, setValue } = useFormContext();
  const categoryId = watch("category_id");
  const selected = categories.find(({ id }) => id === categoryId);
  const { t } = useTranslation();

  return (
    <Autocomplete
      onChange={(_, v) => setValue("category_id", v ? v.id : null)}
      value={selected}
      options={categories}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={t("search.category")}
          name="category"
        />
      )}
    />
  );
};

const Priority = () => {
  const priorities = useFetchTicketsData("support-tickets-priorities");
  const { watch, setValue } = useFormContext();
  const priorityId = watch("priority_id");
  const selected = priorities.find(({ id }) => id === priorityId);
  const { t } = useTranslation();

  return (
    <Autocomplete
      onChange={(_, v) => setValue("priority_id", v ? v.id : null)}
      value={selected}
      options={priorities}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          size="small"
          label={t("search.priority")}
          name="priority"
        />
      )}
    />
  );
};

export default Filter;
