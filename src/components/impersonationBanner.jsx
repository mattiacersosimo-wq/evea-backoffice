import { Alert, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import useAuth from "src/hooks/useAuth";

import fetchUser from "src/utils/fetchUser";
import { setSession } from "src/utils/jwt";

const ImpersonationBanner = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isImpersonate = localStorage.getItem("isImpersonate");
  const goBackToAdmin = async () => {
    const params = {
      sub_admin_impersonate: localStorage.getItem("source_id") || null,
    };

    try {
      const {
        status,
        data: { access_token, menu_list },
      } = await fetchUser.get("back-to-admin", { params });
      if (status === 200) {
        localStorage.removeItem("profile");
        localStorage.setItem("isAdmin", true);
        localStorage.setItem("menu", JSON.stringify(menu_list));
        localStorage.removeItem("isSubAdmin");
        localStorage.removeItem("isImpersonate");
        setSession(access_token);

        const impersonationSource = sessionStorage.getItem(
          "impersonationSource"
        );

        if (impersonationSource) {
          window.location = `${window.origin}${impersonationSource}`;
        } else {
          window.location = window.origin;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return isImpersonate ? (
    <Alert severity="info" sx={{ mb: 1 }}>
      {t("impersonate.heads")} {user.username}
      <Button
        size="small"
        variant="text"
        onClick={goBackToAdmin}
        sx={{
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        {t("impersonate.click")}
      </Button>
      , {t("impersonate.toGo")}
    </Alert>
  ) : null;
};

export default ImpersonationBanner;
