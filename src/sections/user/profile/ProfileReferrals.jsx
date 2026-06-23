import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import ParseDate from "src/components/date";
import Translate from "src/components/translate";

import axiosInstance from "src/utils/axios";

const ProfileReferrals = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const data = await axiosInstance("/api/referrals");
    setData(data.data.referrals);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Card sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.primary" mt={2} mb={2}>
          <Translate>{"profile.referrals"}</Translate>
        </Typography>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{"profile.no"}</TableCell>
                  <TableCell>{"profile.userName"} </TableCell>
                  <TableCell>{"profile.email"}</TableCell>
                  <TableCell>{"profile.active"}</TableCell>
                  <TableCell>{"profile.businessBuilder"}</TableCell>
                  <TableCell>{"profile.dateJoined"}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((item, i) => (
                  <TableRow>
                    <TableCell>{++i}</TableCell>
                    <TableCell>{item?.username} </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{Boolean(item.active) ? "Yes" : "No"}</TableCell>
                    <TableCell>_</TableCell>
                    <TableCell>
                      <ParseDate date={item.created_at} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        {/* <Alert severity="warning" color="warning">
           Empty
        </Alert> */}
      </Card>
    </div>
  );
};

export default ProfileReferrals;
