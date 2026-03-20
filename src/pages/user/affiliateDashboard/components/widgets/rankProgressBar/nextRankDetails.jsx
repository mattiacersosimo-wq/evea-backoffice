import React from "react";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Item from "./item";
import { useTranslation } from "react-i18next";

const NextRankDetails = ({ current_rank_details }) => {
  const { t } = useTranslation();
  if (!current_rank_details) return null;

  return (
    <Stack spacing={0.5}>
      <Item
        title={t("affiliate_dashboard.personal_qualifying_volume")}
        required={Number(current_rank_details?.pqv_required)}
        completed={Number(current_rank_details?.current_pqv)}
        status={Number(current_rank_details?.current_pqv) >= Number(current_rank_details?.pqv_required)}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current_rank_details?.pqv_users?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.username}</TableCell>
                  <TableCell align="right">{item?.taken_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Item>
      <Item
        title={t("affiliate_dashboard.team_volume")}
        required={Number(current_rank_details?.tv_required)}
        completed={Number(current_rank_details?.current_tv)}
        status={Number(current_rank_details?.current_tv) >= Number(current_rank_details?.tv_required)}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current_rank_details?.tv_users?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.username}</TableCell>
                  <TableCell align="right">{item?.taken_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Item>
      <Item
        title={t("affiliate_dashboard.group_volume")}
        required={Number(current_rank_details?.gv_required)}
        completed={Number(current_rank_details?.current_gv)}
        status={Number(current_rank_details?.current_gv) >= Number(current_rank_details?.gv_required)}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("affiliate_dashboard.username")}</TableCell>
                <TableCell align="right">{t("affiliate_dashboard.qv")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {current_rank_details?.gv_users?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.username}</TableCell>
                  <TableCell align="right">{item?.taken_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Item>
    </Stack>
  );
};

export default NextRankDetails;
