import { Card, IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import { capitalCase } from "change-case";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PayoutTableItem from "src/components/payout-table-item";
import Ternary from "src/components/ternary";
import { Currency } from "src/components/with-prefix";
import fetchUser from "src/utils/fetchUser";
import getPayoutNameFromId from "src/utils/get-payout-name-from-id";
import { PAYOUT_TYPE_IDS } from "src/utils/types";

const headers = [
    "financial.payout.table.no",
    "financial.payout.table.amount",
    "financial.payout.table.payout_method",
    "financial.payout.table.payout_info",
    "financial.payout.table.status",
    "financial.payout.table.date",
    "",
];

const DataList = ({ state, rowStart, onRefresh }) => {
    const { data, ...dataProps } = state;
    const { enqueueSnackbar } = useSnackbar();

    return (
        <>
            <Card sx={{ mt: 2, pt: 1 }}>
                <Scrollbar>
                    <DataHandlerTable
                        name="faq-table"
                        headers={headers}
                        dataProps={{ ...dataProps }}
                    >
                        <Map
                            list={data}
                            render={(item, i) => {
                                const paymentType = parseInt(
                                    item?.payment_type
                                );

                                return (
                                    <>
                                        <TableRow>
                                            <TableCell>
                                                {i + rowStart}
                                            </TableCell>
                                            <TableCell>
                                                <Currency>
                                                    {item.amount}
                                                </Currency>
                                            </TableCell>
                                            <TableCell>
                                                {getPayoutNameFromId(
                                                    item.payment_type
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Ternary
                                                    when={
                                                        paymentType ===
                                                        PAYOUT_TYPE_IDS.crypto
                                                    }
                                                    then={
                                                        <TableCell>
                                                            <PayoutTableItem>
                                                                {
                                                                    item
                                                                        ?.payout_details
                                                                        ?.coin_payout
                                                                        ?.coin_id
                                                                }
                                                                :{" "}
                                                                {
                                                                    item
                                                                        ?.payout_details
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
                                                                    item
                                                                        ?.payout_details
                                                                        ?.manual_payout
                                                                        ?.iban
                                                                }
                                                            </PayoutTableItem>
                                                            <br />
                                                            <PayoutTableItem>
                                                                SWIFT:{" "}
                                                                {
                                                                    item
                                                                        ?.payout_details
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
                                                                    item
                                                                        ?.payout_details
                                                                        ?.stripe_payout
                                                                        ?.account_number
                                                                }
                                                            </PayoutTableItem>
                                                            <br />
                                                            <PayoutTableItem>
                                                                Routing Number:
                                                                {
                                                                    item
                                                                        ?.payout_details
                                                                        ?.stripe_payout
                                                                        ?.routing_number
                                                                }
                                                            </PayoutTableItem>
                                                        </TableCell>
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {capitalCase(item.status)}
                                            </TableCell>
                                            <TableCell>
                                                <ParseDate
                                                    date={item.created_at}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {item.status === "pending" && (
                                                    <Tooltip title="Annulla prelievo">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: "#E53935" }}
                                                            onClick={async () => {
                                                                if (!window.confirm("Sei sicuro di voler annullare questo prelievo?")) return;
                                                                try {
                                                                    const { data: res } = await fetchUser.post(`cancel-payout/${item.id}`);
                                                                    enqueueSnackbar(res?.message || "Prelievo annullato");
                                                                    if (onRefresh) onRefresh();
                                                                } catch (err) {
                                                                    enqueueSnackbar(err?.response?.data?.message || "Errore", { variant: "error" });
                                                                }
                                                            }}
                                                        >
                                                            <Iconify icon="mdi:close-circle-outline" width={20} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                );
                            }}
                        />
                    </DataHandlerTable>
                </Scrollbar>
            </Card>
        </>
    );
};

export default DataList;
