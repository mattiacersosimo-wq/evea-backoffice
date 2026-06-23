import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Page from "src/components/Page";
import PaginationButtons from "src/components/pagination";
import TableMenu from "src/components/tableMenu";
import Ternary from "src/components/ternary";
import BlockDialog from "src/pages/admin/members/network/component/BlockDialog";
import { isMenuActive } from "src/utils/actionProtector";
import serializeDate from "src/utils/serialize-date";
import { object, string } from "yup";
import Actions from "../actions";
import AddProductDialog from "./components/add-dialog";
import DeleteDialog from "./components/delete-dialog";
import EditDialog from "./components/edit-dialog";
import Options from "./components/options";
import ReportCard from "./components/report-card";
import ProductHistoryTable from "./components/table";
import UserList from "./components/user-list";
import useProductHistoryList from "./hooks/use-product-history-list";

const defaultValues = {
  start_date: null,
  end_date: null,
  user_id: null,
  email: null,
  product_id: null,
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
  payment_type: string()
    .transform((v) => (v ? v : null))
    .nullable(),
});

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    add: test("add-product"),
    edit: test("edit-product"),
    remove: test("delete-product"),
  };
};

const ProductHistory = () => {
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const filter = methods.watch();

  const [openMenu, setOpenMenuActions] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const { fetchProductHistoryList, state, rowStart, ...rest } =
    useProductHistoryList(filter);

  const handleOpenMenu = (id, user_id, blocked) => (event) => {
    setOpenMenuActions(event.currentTarget);
    setIsBlocked(blocked);
    setUserId(user_id);
    setSelectedId(id);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => {
    setOpenDelete(true);
    handleCloseMenu();
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedId(null);
  };

  const handleClickOpenAddProduct = () => {
    setOpenAddProduct(true);
  };

  const handleClickOpenEditProduct = () => {
    setOpenEditProduct(true);
    handleCloseMenu();
  };

  const handleCloseAddProduct = () => {
    setOpenAddProduct(false);
  };

  const handleCloseEditProduct = () => {
    setOpenEditProduct(false);
  };

  const handleOpenBlock = () => {
    setOpenBlock(true);
    handleCloseMenu();
  };

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };
  const onFilter = methods.handleSubmit(async (inputData) => {
    await fetchProductHistoryList(1, inputData);
  });

  const { add, ...status } = genStatus("nav.store.title", "nav.store.assign");

  return (
    <Page title="Product History: Store">
      <Ternary
        when={add}
        then={<Options openProduct={handleClickOpenAddProduct} />}
      />
      <ReportCard methods={methods} onFilter={onFilter} />
      <UserList>
        <ProductHistoryTable
          rowStart={rowStart}
          dataList={state}
          handleOpenMenu={handleOpenMenu}
        />

        <TableMenu onClose={handleCloseMenu} open={openMenu}>
          <Actions
            status={status}
            openBlock={handleOpenBlock}
            userId={userId}
            openDelete={handleOpenDelete}
            openEdit={handleClickOpenEditProduct}
          />
        </TableMenu>
      </UserList>

      <BlockDialog
        isBlocked={isBlocked}
        selectedId={userId}
        open={openBlock}
        onClose={handleCloseBlock}
        fetchData={() => fetchProductHistoryList(rest.page)}
      />

      <DeleteDialog
        deleteId={selectedId}
        open={openDelete}
        onClose={handleCloseDelete}
        fetchData={() => fetchProductHistoryList(rest.page)}
      />

      <EditDialog
        open={openEditProduct}
        onClose={handleCloseEditProduct}
        selectedId={selectedId}
        fetchData={() => fetchProductHistoryList(rest.page)}
      />

      <AddProductDialog
        open={openAddProduct}
        onClose={handleCloseAddProduct}
        fetchData={() => fetchProductHistoryList(rest.page)}
      />

      <PaginationButtons {...rest} />
    </Page>
  );
};

export default ProductHistory;
