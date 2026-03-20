import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Grid, Tab, Tabs } from "@mui/material";
import { last } from "lodash";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import FilterBar from "src/components/filterBar";
import GetReport from "src/components/getReport";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import RHFDatePicker from "src/components/hook-form/RHFDatePicker";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import Ternary from "src/components/ternary";

import { useTranslation } from "react-i18next";
import TableMenu from "src/pages/admin/settings/@shared/tableMenu.jsx";
import { PATH_DASHBOARD } from "src/routes/paths";
import { isMenuActive } from "src/utils/actionProtector";
import getPageForDelete from "src/utils/get-page-for-delete";
import serializeDate from "src/utils/serialize-date";
import stripNullFromObject from "src/utils/strip-null-from-object";
import { object, string } from "yup";
import Actions from "./components/Actions";
import HeaderCrumps from "./components/HeaderCrumps";
import DataList from "./components/blogRow";
import DeleteDialog from "./components/deleteDialog";
import PublishDialog from "./components/publish";
import useBlog from "./hooks/useBlog";

const headers = [
  "blogs.create.table.no",
  "blogs.create.table.img",
  "blogs.create.table.title",
  "blogs.create.table.desc",
  // "blogs.create.table.scope",
  "blogs.create.table.date",
  "blogs.create.table.action",
];

const defaultFilterValue = {
  start_date: null,
  end_date: null,
  title: null,
  scope: "-1",
  is_draft: null,
};

const schema = object().shape({
  start_date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .test("is-valid", "errors.date.valid_start.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.end_date === null) return true;
      return (
        moment(ctx.parent.end_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) > 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
  end_date: string()
    .test("is-valid", "errors.date.valid_date.test", (v) => {
      if (v === null) return true;
      return moment(v, "YYYY/MM/DD").isValid();
    })
    .test("is-valid", "errors.date.valid_end.test", (v, ctx) => {
      if (v === null) return true;
      if (ctx.parent.start_date === null) return true;
      return (
        moment(ctx.parent.start_date, "YYYY/MM/DD").diff(
          moment(v, "YYYY/MM/DD")
        ) < 0
      );
    })
    .transform((v) => serializeDate(v))
    .nullable(),
});
const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add"),
    edit: test("edit"),
    delete: test("delete"),
    draft: test("draft"),
    category: test("category"),
    publish: test("publish"),
  };
};

const BlogList = ({ isDraft = false }) => {
  const { state, blogList, fetchBlogList, rowStart, ...rest } =
    useBlog(isDraft);
  const { data, ...dataProps } = state;
  const [selectedId, setSelectedId] = useState(null);
  const [openMenu, setOpenMenuActions] = useState(null);
  const handleOpenMenu = (id) => (event) => {
    setSelectedId(id);
    setOpenMenuActions(event.currentTarget);
  };

  const status = genStatus("nav.communication.title", "nav.communication.blog");
  const handleCloseMenu = () => setOpenMenuActions(null);

  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const [publishDialog, setOpenPublish] = useState(false);
  const handleOpenPublish = () => {
    setOpenPublish(true);
    handleCloseMenu();
  };
  const handleClosePublish = () => setOpenPublish(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const linkTo = (slug) => PATH_DASHBOARD.communication.viewBlog(slug);

  const filterMethods = useForm({
    defaultValues: defaultFilterValue,
    resolver: yupResolver(schema),
  });

  const filter = filterMethods.watch();
  const { t } = useTranslation();
  return (
    <>
      <HeaderCrumps
        showCategory={status.category}
        showAdd={status.add}
        name="blogs.title"
      />
      <FilterBar>
        <FormProvider
          methods={filterMethods}
          onSubmit={filterMethods.handleSubmit((inputData) => {
            fetchBlogList(1, {
              ...stripNullFromObject(inputData),
              is_draft: isDraft ? 1 : 0,
            });
          })}
        >
          <Grid container spacing={1}>
            <Grid item md={2.4} sm={1}>
              <RHFTextField name="title" size="small" label="search.title" />
            </Grid>
            <Grid item md={2.4} sm={1}>
              <RHFDatePicker
                label="date.start"
                name="start_date"
                size="small"
              />
            </Grid>
            <Grid item md={2.4} sm={1}>
              <RHFDatePicker label="date.end" name="end_date" size="small" />
            </Grid>
            {/* <Grid item md={2.4} sm={1}>
              <RHFSelect
                InputLabelProps={{ shrink: true }}
                label="search.scope"
                name="scope"
                size="small"
              >
                <option value={-1}>{t("scope.all")}</option>
                <option value={0}>{t("scope.public")}</option>
                <option value={1}>{t("scope.private")}</option>
              </RHFSelect>
            </Grid> */}

            <Grid item md={2.4} sm={1}>
              <GetReport size="medium" />
            </Grid>
          </Grid>
        </FormProvider>
      </FilterBar>

      <Ternary
        when={status.draft}
        then={
          <Tabs
            sx={{ marginBottom: 2 }}
            value={last(pathname.split("/"))}
            onChange={(_, v) => {
              rest.onChange(null, 1);
              navigate(linkTo(v));
            }}
          >
            <Tab value="published" label={t("blogs.tabs.published")} />
            <Tab value="drafts" label={t("blogs.tabs.drafts")} />
          </Tabs>
        }
      />

      <Card sx={{ pt: 2 }}>
        <Scrollbar>
          <DataHandlerTable
            name={isDraft ? "draft-table" : "published-table"}
            headers={headers}
            dataProps={{ ...dataProps }}
          >
            <Map
              list={data}
              render={(blogList, i) => (
                <DataList
                  disableAction={!(status.edit || status.delete)}
                  handleOpenMenu={handleOpenMenu}
                  blogList={blogList}
                  rowNumber={rowStart + i}
                />
              )}
            />
          </DataHandlerTable>
        </Scrollbar>

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            status={status}
            openDelete={handleOpenDelete}
            selectedId={selectedId}
            openPublish={handleOpenPublish}
            isDraft={isDraft}
          />
        </TableMenu>
      </Card>

      <DeleteDialog
        open={openDelete}
        fetchData={() => {
          rest.onChange(null, getPageForDelete(rest.page, data.length));
          fetchBlogList(
            getPageForDelete(rest.page, data.length),
            { ...filter, is_draft: Number(isDraft) },
            isDraft
          );
        }}
        onClose={handleCloseDelete}
        selectedId={selectedId}
        isDraft={isDraft}
      />

      <PublishDialog
        open={publishDialog}
        onClose={handleClosePublish}
        selectedId={selectedId}
      />
      <Ternary
        when={!dataProps.isArrayEmpty}
        then={<PaginationButtons {...rest} />}
      />
    </>
  );
};

export default BlogList;
