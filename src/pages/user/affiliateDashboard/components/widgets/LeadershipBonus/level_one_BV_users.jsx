import React from "react";
import { Card, Collapse, TableCell, TableRow } from "@mui/material";
import Map from "src/components/map";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";

const headers = ["S.No", "Username", "Rank", "BV"];

const Level_One_BV_Users = ({ bv_users = [], state, open }) => {
  const { data, ...dataProps } = state;

  return (
    <>
      <Collapse in={open} collapsedSize={0}>
        <Card sx={{ pt: 1, mt: 2 }}>
          <Scrollbar>
            <DataHandlerTable
              name="faq-table"
              headers={headers}
              dataProps={{
                ...dataProps,
                isArrayEmpty: !bv_users?.length,
              }}
            >
              <Map
                list={bv_users}
                render={(item, i) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{item?.username}</TableCell>
                      <TableCell>{item?.rank_name}</TableCell>
                      <TableCell>{item?.bv}</TableCell>
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

export default Level_One_BV_Users;
