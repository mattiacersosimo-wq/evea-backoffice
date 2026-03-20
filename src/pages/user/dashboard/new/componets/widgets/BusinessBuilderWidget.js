import React, { useEffect, useState } from "react";
// @mui
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import useErrors from "src/hooks/useErrors";

import fetchUser from "src/utils/fetchUser";
import "./style.css";

const useBenefits = () => {
  const [ranks, setRanks] = useState({});
  const handleErrors = useErrors();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, data } = await fetchUser("rank-benifits");
        if (status === 200) {
          const { data: list } = data;
          const temp = {};
          list.forEach(({ rank_name, message }) => {
            temp[rank_name] = message;
          });

          setRanks(temp);
        }
      } catch (err) {
        handleErrors(err);
      }
    };
    fetchData();
  }, []);

  return ranks;
};

const BusinessBuilderWidget = () => {
  const [selected, setSelected] = useState("");
  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  const rank = useBenefits();
  useEffect(() => {
    const [first] = Object.keys(rank);
    setSelected(first);
  }, [rank]);

  return (
    <>
      <Card sx={{ borderRadius: "7px" }}>
        <Box
          sx={{
            display: "grid",
            padding: 2,
            rowGap: 3,
            columnGap: 2,
            marginTop: 1,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
          }}
        >
          <Box>
            <Typography variant="subtitle2">
              {"userDashboard.businessBuilderBenefits"}
            </Typography>
          </Box>
          <Box>
            <FormControl sx={{ minWidth: "100%" }} size="small">
              <InputLabel size="normal" id="demo-simple-select-label-rank">
                {"userDashboard.selectRank"}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label-rank"
                id="demo-simple-select-label-rank"
                value={selected}
                label="Rank"
                onChange={handleChange}
                size="small"
              >
                {Object.keys(rank).map((k) => (
                  <MenuItem value={k}>{k}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <ul className="s2">
          {rank[selected]?.map((item, i) => (
            <li key={i} style={{ fontSize: "15px" }}>
              {item}
            </li>
          ))}
        </ul>

        <Box
          sx={{
            display: "grid",
            padding: 2,
            rowGap: 3,
            columnGap: 2,
            marginTop: 1,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            },
          }}
        >
          <Button variant="contained" size="small" name="revenue-plan">
            {"userDashboard.revenuePlan"}
          </Button>
          <Button variant="contained" size="small" name="business-builder">
            {"userDashboard.becomeABusinessBuilder"}
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default BusinessBuilderWidget;
