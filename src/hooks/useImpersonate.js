import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import { setSession } from "src/utils/jwt";

const impersonate = async (id) => {
  const URL = `/api/admin/impersonate/${id}`;
  try {
    const { status, data } = await axiosInstance(URL);
    return status === 200 ? data : false;
  } catch (err) {
    throw new Error(err.message);
  }
};

const useImpersonate = (id) => {
  const { enqueueSnackbar } = useSnackbar();
  const onImpersonate = async () => {
    try {
      const {
        access_token,
        user,
        impersonate: isImpersonate,
        sub_admin_impersonate,
        menu_lists,
        package_status,
      } = await impersonate(id);

      if (menu_lists === null) {
        enqueueSnackbar("Cannot impersonate.No menu found!", {
          variant: "error",
        });
        return;
      }
      if (menu_lists.find(Boolean).items?.length === 0) {
        enqueueSnackbar("Cannot impersonate with empty group", {
          variant: "error",
        });
        return;
      }

      if (sub_admin_impersonate) {
        localStorage.setItem("source_id", sub_admin_impersonate);
      }
      localStorage.setItem("package_status", Boolean(package_status));
      localStorage.setItem("menu", JSON.stringify(menu_lists));
      localStorage.setItem("isAdmin", Boolean(user.is_super_admin));
      localStorage.setItem("isSubAdmin", Boolean(user.is_sub_admin));
      localStorage.setItem("isImpersonate", Boolean(isImpersonate));
      sessionStorage.setItem("impersonationSource", window.location.pathname);
      setSession(access_token);

      if (Boolean(user.is_sub_admin)) {
        const [menu] = menu_lists;
        const { path, children } = menu?.items[0] || {};

        if (path.includes("dashboard")) {
          window.location = children[0]?.path;
          return;
        }
        if (children.length > 0) {
          window.location = children.find(Boolean).path;
        } else {
          window.location = path;
        }
        return;
      }
      window.location = window.origin;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  return onImpersonate;
};

export default useImpersonate;
