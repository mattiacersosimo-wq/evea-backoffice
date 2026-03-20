import {
  Box,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_USER } from "src/routes/paths";
import HistoryTable from "./historyTable";

const OrderHistory = () => {
  return (
    <Page title="Order History">
      <Container maxWidth="100%">
        <HeaderBreadcrumbs
          heading="Order History"
          links={[
            { name: "Dashboard", href: PATH_USER.root },
            { name: "Order History" },
          ]}
        />

        <Card
          sx={{
            padding: "3rem",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <TextField label="Filter" />
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Show</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Show"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
          <HistoryTable />
        </Card>
      </Container>
    </Page>
  );
};

export default OrderHistory;
