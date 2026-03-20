import { Box, Card, Collapse, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Iconify from "../Iconify";

const FilterBar = ({ children, openByDefault = true }) => {
  const [openFilter, setOpenFilter] = useState(() => {
    const isMobileView = window.innerWidth <= 600;
    if (isMobileView) {
      return false;
    }
    return openByDefault;
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 600;
      setOpenFilter(isMobileView ? false : openByDefault);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [openByDefault]);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          textAlign: "right",
          mb: 1,
        }}
      >
        <IconButton onClick={() => setOpenFilter(!openFilter)}>
          <Iconify
            sx={{
              color: "primary.main",
            }}
            icon={openFilter ? "mingcute:close-fill" : "ic:outline-filter-alt"}
          />
        </IconButton>
      </Box>
      <Collapse in={openFilter}>
        <Card sx={{ p: 3, marginBottom: 2 }}>{children}</Card>
      </Collapse>
    </>
  );
};

export default FilterBar;
