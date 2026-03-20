import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import useDepartmentList from "src/components/ProductAutoComplete/hooks/useDepartmentList";
import UsersSearch from "src/components/autoComplete/users";
import GetReport from "src/components/getReport";
import {
  FormProvider,
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Map from "src/components/map";
import useGetCategory from "../hooks/useGetCategory";
import useGetPriority from "../hooks/useGetPriority";

const Status = [
  { name: "help_center.status.open", value: "open" },
  { name: "help_center.status.overdue", value: "overdue" },
  { name: "help_center.status.resolved", value: "resolved" },
  { name: "help_center.status.closed", value: "closed" },
  { name: "help_center.status.archived", value: "archived" },
  { name: "help_center.status.deleted", value: "deleted" },
  { name: "help_center.status.unverified", value: "unverified" },
  { name: "help_center.status.request_approval", value: "request_approval" },
  { name: "help_center.status.in_progress", value: "in_progress" },
  { name: "help_center.status.responded", value: "responded" },
];
const Filter = ({ methods, onFilter }) => {
  const categoryList = useGetCategory();
  const departmentList = useDepartmentList();
  const priority = useGetPriority();

  const { t } = useTranslation();

  return (
    <>
      <FormProvider methods={methods} onSubmit={onFilter}>
        <Box
          sx={{
            display: "grid",
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          <RHFSelect
            name="department_id"
            size="small"
            label="help_center.filter.department"
          >
            <option />
            <Map
              list={departmentList}
              render={({ name, id }) => <option value={id}>{name}</option>}
            />
          </RHFSelect>
          <RHFSelect
            name="priority_id"
            size="small"
            label="help_center.filter.priority"
          >
            <option />
            <Map
              list={priority}
              render={({ name, id }) => <option value={id}>{name}</option>}
            />
          </RHFSelect>
          <RHFSelect
            name="status"
            size="small"
            label="help_center.filter.status"
          >
            <option />
            <Map
              list={Status}
              render={({ value, name }) => (
                <option value={value}>{t(name)}</option>
              )}
            />
          </RHFSelect>
          <RHFSelect
            name="category_id"
            size="small"
            label="help_center.filter.category"
          >
            <option />
            <Map
              list={categoryList}
              render={({ name, id }) => <option value={id}>{name}</option>}
            />
          </RHFSelect>
          <RHFTextField
            label="help_center.filter.tkt_id"
            name="ticket_number"
            size="small"
          />
          <UsersSearch name="from_user" props={{ size: "small" }} />
          <RHFCheckbox name="overdue" label="help_center.filter.overdue" />
          <GetReport size="medium" />
        </Box>
      </FormProvider>
    </>
  );
};

export default Filter;
