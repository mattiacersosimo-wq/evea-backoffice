import { Box, Button } from "@mui/material";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";

import { Dialog, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { AddForm } from "./form";
import Transition from "src/utils/dialog-animation";

const ArticleWrapper = ({ children, fetchCategoryList, showAdd }) => {
  const theme = useTheme();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);

  const handleClickOpenCreateCategory = () => {
    setOpenCreateCategory(true);
  };

  const handleCloseCreateCategory = () => {
    setOpenCreateCategory(false);
  };
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const buttonProps = {
    size: isSmallScreen ? "small" : "medium",
  };
  return (
    <>
      <div>
        <HeaderBreadcrumbs
          links={[{ name: "articles.categories.title" }]}
          action={
            <Ternary
              when={showAdd}
              then={
                <Box
                  sx={{
                    display: "grid",
                    columnGap: 1,
                    rowGap: 3,
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(1, 1fr)",
                    },
                  }}
                >
                  <Button
                    {...buttonProps}
                    variant="contained"
                    startIcon={<Iconify icon={"eva:plus-fill"} />}
                    onClick={handleClickOpenCreateCategory}
                    size="small"
                  >
                    <Translate>articles.categories.add_button</Translate>
                  </Button>
                </Box>
              }
            />
          }
        />
        {children}
      </div>

      <Dialog
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
        open={openCreateCategory}
        onClose={handleCloseCreateCategory}
        aria-labelledby="add-article-category"
      >
        <AddForm
          fetchData={fetchCategoryList}
          onClose={handleCloseCreateCategory}
        />
      </Dialog>
    </>
  );
};

export default ArticleWrapper;
