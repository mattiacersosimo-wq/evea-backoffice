import React, { useState } from "react";
import {
  Box,
  Card,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Iconify from "src/components/Iconify";
import Map from "src/components/map";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import { useTranslation } from "react-i18next";

const headers = [
  "affiliate_dashboard.s_no",
  "affiliate_dashboard.username",
  "affiliate_dashboard.total_bonus",
];

const LevelDetails = ({ levels = [], state }) => {
  const { t } = useTranslation();
  const { data, ...dataProps } = state;
  const [open, setOpen] = useState(false);
  const [openLevels, setOpenLevels] = useState({});

  const handleToggle = (level) => {
    setOpenLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="subtitle1">
          {t("affiliate_dashboard.levels")}
        </Typography>
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          size="small"
          sx={{
            ml: 2,
            backgroundColor: "#cccccc47",
            transition: "transform 0.4s ease-in-out",
            transform: open ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <Iconify icon="ep:arrow-up-bold" />
        </IconButton>
      </Box>
      <Collapse in={open} collapsedSize={0}>
        <Card sx={{ mt: 2, p: 2 }}>
          <Map
            list={levels}
            render={(level) => {
              const isOpen = openLevels[level.level];

              return (
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1">
                      Level {level.level}
                    </Typography>

                    <IconButton
                      onClick={() => handleToggle(level.level)}
                      size="small"
                      sx={{
                        ml: 2,
                        backgroundColor: "#cccccc47",
                        transition: "transform 0.3s",
                        transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                      }}
                    >
                      <Iconify icon="ep:arrow-up-bold" />
                    </IconButton>
                  </Box>

                  <Collapse in={isOpen} collapsedSize={0}>
                    <Card sx={{ mt: 2, p: 2 }}>
                      <Scrollbar>
                        <DataHandlerTable
                          headers={headers}
                          dataProps={{
                            ...dataProps,
                            isArrayEmpty: !level?.users?.length,
                          }}
                        >
                          <Map
                            list={level.users}
                            render={(item, i) => (
                              <TableRow>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>{item.total_bonus}</TableCell>
                              </TableRow>
                            )}
                          />
                        </DataHandlerTable>
                      </Scrollbar>
                    </Card>
                  </Collapse>
                </Box>
              );
            }}
          />
        </Card>
      </Collapse>
    </>
  );
};

export default LevelDetails;
