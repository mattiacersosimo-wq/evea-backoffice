import { Box } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

const TreeWrapper = ({ children, title, links }) => {
  return (
    <Page title={title}>
      <Box>
        <HeaderBreadcrumbs heading={title} links={links} />
        {children}
      </Box>
    </Page>
  );
};

export default TreeWrapper;
