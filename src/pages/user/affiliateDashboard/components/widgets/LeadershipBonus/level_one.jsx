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
import Level_One_BV_Users from "./level_one_BV_users";
import DataHandlerTable from "src/components/data-handler/table";
import Scrollbar from "src/components/Scrollbar";
import { useTranslation } from "react-i18next";

const headers = [
  "affiliate_dashboard.s_no",
  "affiliate_dashboard.leader_name",
  "affiliate_dashboard.rank_name",
  "affiliate_dashboard.team_bv",
  "affiliate_dashboard.bonus_percentage",
  "affiliate_dashboard.pending_bonus",
];

const Level_One = ({ level_one = [], state }) => {
  const [open, setOpen] = useState(false);
  const { data, ...dataProps } = state;
  const [openBVUsers, setOpenBVUsers] = useState({});

  const { t } = useTranslation();

  const toggleBVUsers = (index) => {
    setOpenBVUsers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pt: 3,
        }}
      >
        <Typography variant="subtitle1">
          {t("affiliate_dashboard.generation_1")}
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
        <Card sx={{ pt: 1, mt: 2 }}>
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{
                ...dataProps,
                isArrayEmpty: !level_one?.customers?.length,
              }}
            >
              <Map
                list={level_one?.customers}
                render={(item, i) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2" fontSize="14px">
                            {item?.customer_username}
                          </Typography>
                          <IconButton
                            onClick={() => toggleBVUsers(i)}
                            size="small"
                            sx={{
                              ml: 2,
                              backgroundColor: "#cccccc47",
                              transition: "transform 0.4s ease-in-out",
                              transform: openBVUsers[i]
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                            }}
                          >
                            <Iconify icon="ep:arrow-up-bold" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>{item?.rank_name}</TableCell>
                      <TableCell>{item?.bv}</TableCell>
                      <TableCell>{item?.percentage}</TableCell>
                      <TableCell>{item?.pending_bonus}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Level_One_BV_Users
                          open={!!openBVUsers[i]}
                          state={state}
                          bv_users={item?.bv_users}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                )}
              />
            </DataHandlerTable>
          </Scrollbar>
        </Card>
      </Collapse>
    </>
  );
};

export default Level_One;
