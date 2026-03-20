import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";

const AddGroupButton = ({ openAdd, onOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <Button
      color={openAdd ? "error" : "primary"}
      onClick={openAdd ? onClose : onOpen}
      variant="contained"
      startIcon={
        <Iconify
          icon={openAdd ? "material-symbols:close" : "material-symbols:add"}
        />
      }
    >
      <Ternary
        when={openAdd}
        then={t("sub_admin.cancel")}
        otherwise={t("sub_admin.group")}
      />
    </Button>
  );
};

export default AddGroupButton;
