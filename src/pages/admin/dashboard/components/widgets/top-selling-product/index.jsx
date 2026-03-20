import {
  Box,
  Card,
  CardHeader,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import useTopSellingProducts from "./hooks/use-top-selling-products";
import { useTheme } from "@mui/material/styles";

const headers = ["global.no", "global.name_package", "global.sold_out"];

const TopSellingProducts = () => {
  const { t } = useTranslation();
  const { data, ...dataProps } = useTopSellingProducts();
  const theme = useTheme();

  return (
    <Card>
      <Box sx={{ height: "430px" }}>
        <CardHeader
          title={
            <Typography variant="subtitle2" sx={{ ml: "-10px", mt: "-7px" }}>
              {t("business.topSellingProducts")}
            </Typography>
          }
          sx={{ mb: 2 }}
        />

        <Box sx={{ pb: 2 }}>
          <Box>
            <Box sx={{ pb: 2 }}>
              <DataHandlerTable
                dataProps={dataProps}
                headers={headers}
                sx={{ height: "360px" }}
              >
                <Map
                  list={data}
                  render={({ count, product, ...rest }, i) => {
                    return (
                      <TableRow>
                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontWeight: "300",
                            color: theme.palette.widgets.tertiary[400],
                          }}
                        >
                          {i + 1}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontWeight: "300",
                            color: theme.palette.widgets.tertiary[400],
                          }}
                        >
                          {product?.name}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: theme.palette.widgets.tertiary[400],
                          }}
                        >
                          {count}
                        </TableCell>
                      </TableRow>
                    );
                  }}
                />
              </DataHandlerTable>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default TopSellingProducts;
