import { Divider, MenuItem } from "@mui/material";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

const Actions = ({
  openEdit,
  openDelete,
  disableEdit,
  disableDelete,
  status,
}) => {
  const { edit, delete: deleteReview } = status;
  return (
    <>
      <Ternary
        when={edit}
        then={null}
        otherwise={
          <MenuItem
            disabled={disableEdit}
            sx={{ color: "default.main" }}
            onClick={openEdit}
          >
            <Iconify icon={"akar-icons:edit"} />
            {"adminStore.coupons.edit"}
          </MenuItem>
        }
      />

      <Ternary
        when={deleteReview}
        then={null}
        otherwise={
          <>
            <Divider />
            <MenuItem
              disabled={disableDelete}
              sx={{ color: "error.main" }}
              onClick={openDelete}
            >
              <Iconify icon={"eva:trash-2-outline"} />
              {"adminStore.coupons.delete"}
            </MenuItem>
          </>
        }
      />
    </>
  );
};

export default Actions;
