import { Card, TableCell, TableRow } from "@mui/material";
import { capitalCase } from "change-case";
import { useEffect } from "react";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import PayoutTableItem from "src/components/payout-table-item";
import Ternary from "src/components/ternary";
import { Currency } from "src/components/with-prefix";
import useFilterForm from "src/hooks/useFilter/useFilterForm";
import getPayoutNameFromId from "src/utils/get-payout-name-from-id";
import serializeDate from "src/utils/serialize-date";
import { PAYOUT_TYPE_IDS } from "src/utils/types";
import usePayout from "../../hooks/use-payout";
import DataFilter from "./data-filter";

const headers = [
    "financial.payout.admin.history.table.no",
    "financial.payout.admin.history.table.user_name",
    "financial.payout.admin.history.table.email",
    "financial.payout.admin.request.table.payout_method",
    "financial.payout.admin.request.table.payout_info",
    "financial.payout.admin.history.table.requested",
    "financial.payout.admin.history.table.admin_fee",
    "financial.payout.admin.history.table.released",
    "financial.payout.admin.history.table.date",
    "financial.payout.admin.history.table.status",
];

const PayoutHistory = () => {
    const methods = useFilterForm();
    const { fetchPayoutData, state } = usePayout();

    const { data, ...dataProps } = state;
    const { payoutHistory } = data;
    const { count, onChange, page, rowStart, seed } = usePagination();
    const filter = methods.watch();
    useEffect(() => {
        seed(payoutHistory.last_page, payoutHistory.from);
    }, [payoutHistory]);

    useEffect(() => {
        const { start_date, end_date, ...rest } = filter;
        fetchPayoutData(page, {
            start_date: serializeDate(start_date),
            end_date: serializeDate(end_date),
            ...rest,
        });
    }, [page]);

    return (
        <>
            <Card sx={{ pt: 1, mt: 2 }}>
                <Scrollbar>
                    <DataFilter fetchData={fetchPayoutData} methods={methods} />

                    <DataHandlerTable
                        name="category-table"
                        dataProps={{ ...dataProps }}
                        headers={headers}
                        forceEmpty={payoutHistory?.data?.length === 0}
                    >
                        <Map
                            list={payoutHistory?.data}
                            render={(item, i) => {
                                const paymentType = parseInt(
                                    item?.payment_type
                                );

                                return (
                                    <TableRow>
                                        <TableCell>{i + rowStart}</TableCell>
                                        <TableCell>
                                            {item?.user?.username}{" "}
                                        </TableCell>
                                        <TableCell>
                                            {item?.user?.email}{" "}
                                        </TableCell>
                                        <TableCell>
                                            {getPayoutNameFromId(
                                                item.payment_type
                                            )}
                                        </TableCell>
                                        <Ternary
                                            when={
                                                paymentType ===
                                                PAYOUT_TYPE_IDS.crypto
                                            }
                                            then={
                                                <TableCell>
                                                    <PayoutTableItem>
                                                        {
                                                            item?.payout_details
                                                                ?.coin_payout
                                                                ?.coin_id
                                                        }
                                                        :{" "}
                                                        {
                                                            item?.payout_details
                                                                ?.coin_payout
                                                                ?.address
                                                        }
                                                    </PayoutTableItem>
                                                </TableCell>
                                            }
                                        />

                                        <Ternary
                                            when={
                                                paymentType ===
                                                PAYOUT_TYPE_IDS.manual
                                            }
                                            then={
                                                <TableCell>
                                                    <PayoutTableItem>
                                                        IBAN:{" "}
                                                        {
                                                            item?.payout_details
                                                                ?.manual_payout
                                                                ?.iban
                                                        }
                                                    </PayoutTableItem>
                                                    <br />
                                                    <PayoutTableItem>
                                                        SWIFT:{" "}
                                                        {
                                                            item?.payout_details
                                                                ?.manual_payout
                                                                ?.swift
                                                        }
                                                    </PayoutTableItem>
                                                </TableCell>
                                            }
                                        />

                                        <Ternary
                                            when={
                                                paymentType ===
                                                PAYOUT_TYPE_IDS.stipe
                                            }
                                            then={
                                                <TableCell>
                                                    <PayoutTableItem>
                                                        Account Number:
                                                        {
                                                            item?.payout_details
                                                                ?.stripe_payout
                                                                ?.account_number
                                                        }
                                                    </PayoutTableItem>
                                                    <br />
                                                    <PayoutTableItem>
                                                        Routing Number:
                                                        {
                                                            item?.payout_details
                                                                ?.stripe_payout
                                                                ?.routing_number
                                                        }
                                                    </PayoutTableItem>
                                                </TableCell>
                                            }
                                        />
                                        <TableCell>
                                            <Currency>{item?.amount}</Currency>
                                        </TableCell>
                                        <TableCell>
                                            <Currency>
                                                {item?.admin_fee_deducted}
                                            </Currency>
                                        </TableCell>
                                        <TableCell>
                                            <Currency>
                                                {item?.released_amount}
                                            </Currency>
                                        </TableCell>
                                        <TableCell>
                                            <ParseDate
                                                date={item?.created_at}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {capitalCase(item?.status || "")}
                                        </TableCell>
                                    </TableRow>
                                );
                            }}
                        />
                    </DataHandlerTable>
                </Scrollbar>
            </Card>
            <PaginationButtons onChange={onChange} page={page} count={count} />
        </>
    );
};

export default PayoutHistory;
