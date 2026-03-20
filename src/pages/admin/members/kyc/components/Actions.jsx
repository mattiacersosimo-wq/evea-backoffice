import { MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { buildApiUrl } from "src/config";
import { PATH_DASHBOARD } from "src/routes/paths";

const Actions = ({ selectedId }) => {
  const editPath = PATH_DASHBOARD.communication.editBlog(selectedId);

  return (
    <>
      <MenuItem
        component={Link}
        to={editPath}
        sx={{ color: "default.main" }}
        name="edit"
      >
        <Iconify icon={"akar-icons:edit"} />
        <Translate>actions.edit</Translate>
      </MenuItem>

      <MenuItem sx={{ color: "success.main" }} name="publish">
        <a
          target="_blank"
          style={{
            textDecoration: "none",
            color: "black",
          }}
          href={buildApiUrl(`api/download-kyc?user_id=${selectedId}/identity`)}
        >
          <Iconify icon={"tabler:download"} />
          <Translate>Identity Proof</Translate>
        </a>
      </MenuItem>
      <MenuItem sx={{ color: "success.main" }} name="publish">
        <a
          target="_blank"
          style={{
            textDecoration: "none",
            color: "black",
          }}
          href={buildApiUrl(`api/download-kyc?user_id=${selectedId}/address`)}
        >
          <Iconify icon={"tabler:download"} />
          <Translate>Proof of Address</Translate>
        </a>
      </MenuItem>
    </>
  );
};

export default Actions;
