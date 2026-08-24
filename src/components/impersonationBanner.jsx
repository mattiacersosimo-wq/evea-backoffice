import { Alert, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useAuth from "src/hooks/useAuth";

import fetchUser from "src/utils/fetchUser";
import { setSession } from "src/utils/jwt";

const ImpersonationBanner = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  // localStorage restituisce stringhe: con Boolean(false) salvato diventa
  // "false", che e' truthy. Senza il confronto esplicito il banner comparirebbe
  // anche a chi non sta impersonando nessuno.
  const isImpersonate = localStorage.getItem("isImpersonate") === "true";
  const goBackToAdmin = async () => {
    const params = {
      sub_admin_impersonate: localStorage.getItem("source_id") || null,
    };

    try {
      const {
        status,
        data: { access_token, menu_list, user: adminUser },
      } = await fetchUser.get("back-to-admin", { params });
      if (status === 200) {
        localStorage.removeItem("profile");
        // I flag vanno letti dal payload, non forzati: chi torna indietro puo'
        // essere un sub-admin (il parametro sub_admin_impersonate lo dice), e
        // scrivere isAdmin=true gli sbloccherebbe lato client le sezioni da
        // super-admin. Il backend le rifiuta comunque, ma l'utente vedrebbe
        // menu che non gli competono e una sfilza di "Unauthorized".
        localStorage.setItem("isAdmin", Boolean(adminUser?.is_super_admin));
        localStorage.setItem("isSubAdmin", Boolean(adminUser?.is_sub_admin));
        localStorage.setItem("menu", JSON.stringify(menu_list));
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
      // Senza questo l'utente resta bloccato in impersonation senza capire
      // perche' il pulsante non faccia nulla.
      enqueueSnackbar(
        err?.message || "Impossibile tornare all'account admin. Riprova.",
        { variant: "error" }
      );
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
