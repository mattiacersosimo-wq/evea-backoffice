import {
    Box,
    Card,
    CardHeader,
    Link,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import DataHandlerTable from "src/components/data-handler/table";
import Map from "src/components/map";
import Translate from "src/components/translate";
import { trim } from "src/pages/admin/store/productCategories/Components/ProductCategory";
import { PATH_DASHBOARD } from "src/routes/paths";
import useLatestSales from "./hooks/use-latest-sales";
const headers = [
    "global.no",
    "global.user",
    "blogs.create.form.type",
    "global.order_id",
    "global.amount_paid",
];

const LatestSales = () => {
    const { data, ...dataProps } = useLatestSales();
    const theme = useTheme();

    return (
        <Card sx={{ height: "100%" }}>
            <CardHeader
                title={
                    <Typography
                        variant="subtitle2"
                        sx={{ ml: "-10px", mt: "-7px" }}
                    >
                        <Translate>business.latestSales</Translate>
                    </Typography>
                }
                sx={{ mb: 2 }}
            />
            <Box sx={{ pb: 2 }}>
                <DataHandlerTable
                    dataProps={dataProps}
                    headers={headers}
                    sx={{
                        height: "360px",
                    }}
                >
                    <Map
                        list={data}
                        render={(
                            {
                                id,
                                user_purchase,
                                purchase_id,
                                product,
                                product_price,
                            },
                            i
                        ) => (
                            <>
                                <TableRow key={id}>
                                    <TableCell
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: "300",
                                            color: theme.palette.widgets
                                                .tertiary[400],
                                        }}
                                    >
                                        {i + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                color: theme.palette.widgets
                                                    .tertiary[400],
                                                fontWeight: "300",
                                            }}
                                        >
                                            {user_purchase?.user?.username}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: "13px",
                                                color: theme.palette.widgets
                                                    .tertiary[600],
                                                fontWeight: "300",
                                            }}
                                        >
                                            {user_purchase?.user?.email}
                                        </Typography>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "300",
                                            color: theme.palette.widgets
                                                .tertiary[400],
                                        }}
                                    >
                                        {trim(product?.name)}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "300",
                                            color: theme.palette.widgets
                                                .tertiary[400],
                                        }}
                                    >
                                        <Link
                                            to={PATH_DASHBOARD.invoices.view(
                                                purchase_id
                                            )}
                                            color="inherit"
                                            component={RouterLink}
                                        >
                                            {user_purchase?.invoice_id}
                                        </Link>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            fontSize: "15px",
                                            fontWeight: "400",
                                            color: theme.palette.widgets
                                                .tertiary[400],
                                        }}
                                    >
                                        {product_price?.price}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    />
                </DataHandlerTable>
            </Box>
        </Card>
    );
};

export default LatestSales;
