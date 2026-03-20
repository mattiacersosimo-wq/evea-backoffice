import { Card, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";
import { isMenuActive } from "src/utils/actionProtector";
import ActionDialog from "./ActionDialog";
import DataFilter from "./filter";
import { useTranslation } from "react-i18next";
import useApproval from "./hooks/use-approval";
import useFilter from "./hooks/use-filter";
import ReasonForm from "./reasonForm";
import StatusDropdown from "./statusDropdown";

const headers = [
    "financial.payout.admin.request.table.no",
    "financial.payout.admin.request.table.user_name",
    "businessBuilder.email",
    "global.products",
    // "order_approvals.tran_ref",
    "global.total_price",
    "search.status",
    "financial.payout.admin.request.table.date",
    // "financial.payout.admin.request.table.action",
];

const genStatus = (gp, p) => {
    const test = isMenuActive(gp, p);
    return {
        approve: test("approve"),
        reject: test("reject"),
    };
};
const Orders = () => {
    const status = genStatus("global.OrderApproval");
    const methods = useFilter();

    const filter = methods.watch();
    const onFilter = methods.handleSubmit((inputData) => {
        fetchData(1, inputData);
    });
    const { state, fetchData, rowStart, page, ...rest } = useApproval(filter);
    const { data, ...dataProps } = state;
    const [approved, setApproved] = useState();
    const [rejected, setRejected] = useState();
    const [selectedId, setSelectedId] = useState();
    const handleOpenApproved = (id) => {
        setSelectedId(id);
        setApproved(true);
    };
    const handleCloseApproved = () => {
        setApproved(false);
    };
    const handleOpenRejected = (id) => {
        setSelectedId(id);
        setRejected(true);
    };
    const handleCloseRejected = () => {
        setRejected(false);
    };

    const { t } = useTranslation();
    return (
        <>
            <Card sx={{ pt: 1 }}>
                <DataFilter onFilter={onFilter} methods={methods} />
                <DataHandlerTable
                    name="category-table"
                    dataProps={{ ...dataProps }}
                    headers={headers}
                >
                    <Map
                        list={data}
                        render={(item, i) => (
                            <TableRow key={item.id}>
                                <TableCell>{i + rowStart}</TableCell>
                                <TableCell>
                                    {item.cart_details.map((cart, index) => {
                                        if (index === 0) {
                                            return <>{cart?.user.username}</>;
                                        }
                                    })}
                                </TableCell>
                                <TableCell>
                                    {item.cart_details.map((cart, index) => {
                                        if (index === 0) {
                                            return <>{cart?.user.email}</>;
                                        }
                                    })}
                                </TableCell>
                                <TableCell>
                                    {item.cart_details.length > 1 ? (
                                        <>
                                            {item.cart_details[0]?.product.name}{" "}
                                            +{(item?.cart_product_count)-1}
                                        </>
                                    ) : (
                                        <>
                                            {" "}
                                            {item.cart_details[0]?.product.name}
                                        </>
                                    )}
                                </TableCell>
                                {/* <TableCell>
                                    {item?.transaction_reference_no}
                                </TableCell> */}
                                <TableCell>
                                    <Currency>{item?.amount}</Currency>
                                </TableCell>
                                {/* <TableCell>
                                    {item.payment_status === "finished"
                                        ? "Approved"
                                        : capitalCase(item.payment_status)}
                                </TableCell> */}
                                <TableCell>
                                    <StatusDropdown item={item} fetchData={fetchData} page={page}/>
                                </TableCell>
                                <TableCell>
                                    <ParseDate date={item.created_at} />
                                </TableCell>

                                {/* <TableCell>
                                    <Stack direction="row" spacing={2}>
                                        <Ternary
                                            when={status.approve}
                                            then={
                                                <Button
                                                    size="small"
                                                    disabled={
                                                        item?.payment_status ===
                                                            "finished" ||
                                                        item?.payment_status ===
                                                            "rejected"
                                                    }
                                                    onClick={() =>
                                                        handleOpenApproved(
                                                            item.id
                                                        )
                                                    }
                                                    startIcon={
                                                        <Iconify icon="akar-icons:check" />
                                                    }
                                                    variant="contained"
                                                    name="payout-approve"
                                                >
                                                    <Translate>
                                                        financial.payout.admin.request.approve
                                                    </Translate>
                                                </Button>
                                            }
                                        />

                                        <Ternary
                                            when={status.reject}
                                            then={
                                                <Button
                                                    disabled={
                                                        item?.payment_status ===
                                                            "rejected" ||
                                                        item?.payment_status ===
                                                            "finished"
                                                    }
                                                    size="small"
                                                    onClick={() =>
                                                        handleOpenRejected(
                                                            item.id
                                                        )
                                                    }
                                                    startIcon={
                                                        <Iconify icon="ant-design:delete-outlined" />
                                                    }
                                                    color="error"
                                                    variant="contained"
                                                    name="payout-reject"
                                                >
                                                    <Translate>
                                                        global.reject
                                                    </Translate>
                                                </Button>
                                            }
                                        />
                                    </Stack>
                                </TableCell> */}
                            </TableRow>
                        )}
                    />
                </DataHandlerTable>
            </Card>
            <PaginationButtons {...rest} />

            <ActionDialog
                fetchData={fetchData}
                title={t("global.approve")}
                statusKyc="approved"
                selectedId={selectedId}
                onClose={handleCloseApproved}
                open={approved}
            />
            <ReasonForm
                fetchData={fetchData}
                title={t("global.reject")}
                selectedId={selectedId}
                onClose={handleCloseRejected}
                open={rejected}
            />
        </>
    );
};

export default Orders;
