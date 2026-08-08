import { Alert, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PATH_DASHBOARD } from "src/routes/paths";

import { TreeWithoutLegend } from "src/components/tree";
import Iconify from "src/components/Iconify";

const UserSponsorTree = () => {
  return (
    <>
      <Box sx={{ px: 3, pt: 2 }}>
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button
              component={RouterLink}
              to="/user/genealogy/effective-team"
              size="small"
              variant="contained"
              endIcon={<Iconify icon="eva:arrow-forward-fill" />}
            >
              Vedi Team Effettivo
            </Button>
          }
        >
          Vuoi vedere <strong>chi contribuisce davvero ai tuoi bonus</strong>?
          Il tuo team effettivo include clienti in profondità e incaricati
          compressi non visibili qui nell'albero fisico.
        </Alert>
      </Box>
      <TreeWithoutLegend
        url="api/user/sponsortree"
        title="genealogy.sponsor.title"
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.root },
          { name: "genealogy.sponsor.title" },
        ]}
      />
    </>
  );
};

export default UserSponsorTree;
