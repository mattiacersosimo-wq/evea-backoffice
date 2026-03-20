import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import React from "react";

const Filter = () => {
  return (
    <Paper
      sx={{
        margin: "1rem 0",
        padding: "2rem",
      }}
    >
      <Grid
        sx={{
          display: "grid",
          columnGap: 2,
          rowGap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        <TextField
          label={"adminUserSubscriptions.userName"}
          placeholder={"adminUserSubscriptions.searchMember"}
          size="small"
        />
        <TextField
          label={"adminUserSubscriptions.userSelectPeriod"}
          placeholder={"adminUserSubscriptions.all"}
          select
          SelectProps={{ native: true }}
          fullWidth
          size="small"
        >
          <option value={1}>{"adminUserSubscriptions.member"} 1</option>
          <option value={2}>{"adminUserSubscriptions.member"} 2</option>
        </TextField>
        <TextField
          label={"adminUserSubscriptions.email"}
          placeholder={"adminUserSubscriptions.enterEmail"}
          size="small"
        />
        <TextField
          label={"adminUserSubscriptions.selectProduct"}
          select
          SelectProps={{ native: true }}
          fullWidth
          size="small"
        >
          <option value={1}>{"adminUserSubscriptions.product"} 1</option>
          <option value={2}>{"adminUserSubscriptions.product"} 2</option>
        </TextField>
        <Box>
          <Button variant="contained" name="get-report">
            {"adminUserSubscriptions.getReport"}
          </Button>
        </Box>
      </Grid>
    </Paper>
  );
};

export default Filter;
