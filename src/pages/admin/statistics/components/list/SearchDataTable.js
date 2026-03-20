import {
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";

const SearchDataTable = () => {
  const dataList = [
    {
      title: "adminStatistics.longTermReports",
      year: 1994,
    },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
    { title: "12 Angry Men", year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
  ];

  return (
    <div>
      <Card sx={{ p: 2 }}>
        <Grid
          sx={{
            display: "grid",
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
            },
          }}
        >
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={dataList.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} />}
            fullWidth
            size="small"
          />

          <Box>
            <Button variant="contained" name="search">
              {"adminStatistics.search"}
            </Button>
          </Box>
        </Grid>
      </Card>
    </div>
  );
};

export default SearchDataTable;
