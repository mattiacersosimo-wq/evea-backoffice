import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Link,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import usePagination from "src/components/pagination/usePagination";
import PayoutTableItem from "src/components/payout-table-item";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import { isMenuActive } from "src/utils/actionProtector";
import getPayoutNameFromId from "src/utils/get-payout-name-from-id";
import { PAYOUT_TYPE_IDS } from "src/utils/types";
import usePayout from "../../hooks/use-payout";
import useHandler from "./hooks/use-handler";

const INPS_RATE_STANDARD = 0.0919;
const INPS_RATE_HIGH = 0.2572;
const SOGLIA_INPS = 6410;

const calcFiscale = (lordo) => {
    const amount = parseFloat(lordo) || 0;
    if (amount <= 0) return null;
    const imponibile = amount * 0.78;
    const ritenuta = imponibile * 0.23;
    const inpsStandard = imponibile * INPS_RATE_STANDARD * 0.333;
    const inpsHigh = imponibile * INPS_RATE_HIGH * 0.333;
    const bollo = amount >= 100 ? 2 : 0;
    const nettoStandard = amount - ritenuta - inpsStandard - bollo;
    const nettoHigh = amount - ritenuta - inpsHigh - bollo;
    return {
        lordo: amount,
        imponibile,
        ritenuta,
        inpsStandard,
        inpsHigh,
        bollo,
        nettoStandard,
        nettoHigh,
    };
};

const FiscaleDetailRow = ({ label, value, color, bold }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
        }}
    >
        <Typography
            variant="body2"
            sx={{ fontWeight: bold ? 700 : 400, color: color || "text.primary" }}
        >
            {label}
        </Typography>
        <Typography
            variant="body2"
            sx={{ fontWeight: bold ? 700 : 400, color: color || "text.primary" }}
        >
            {value}
        </Typography>
    </Box>
);

const headers = [
    "financial.payout.admin.request.table.no",
    "financial.payout.admin.request.table.user_name",
    "financial.payout.admin.request.table.user_balance",
    "financial.payout.admin.request.table.payout_method",
    "financial.payout.admin.request.table.payout_info",
    "financial.payout.admin.request.table.date",
    "financial.payout.admin.request.table.requested",
    "financial.payout.admin.request.table.admin_fee",
    "financial.payout.admin.request.table.released",
    "Netto Stimato",
    "financial.payout.admin.request.table.action",
];

const genStatus = (gp, p) => {
    const test = isMenuActive(gp, p);
    return {
        approve: test("approve"),
        reject: test("reject"),
    };
};

const PayoutRequest = () => {
    const status = genStatus("nav.financial.title", "nav.financial.payout");

    const { fetchPayoutData, state } = usePayout();

    const { data, ...dataProps } = state;
    const { payoutData } = data;
    const { count, onChange, page, rowStart, seed } = usePagination();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);

    useEffect(() => {
        seed(payoutData.last_page, payoutData.from);
    }, [payoutData]);

    useEffect(() => {
        fetchPayoutData(page);
    }, [page]);

    const { approve, reject } = useHandler(() => fetchPayoutData(page));

    const handleOpenDetail = (item) => {
        const fiscale = calcFiscale(item.amount);
        if (!fiscale) return;
        setDialogData({ ...fiscale, username: item.user?.username || "—" });
        setDialogOpen(true);
    };

    return (
        <>
            <Card sx={{ pt: 1 }}>
                <DataHandlerTable
                    name="category-table"
                    dataProps={{ ...dataProps }}
                    forceEmpty={payoutData?.data?.length === 0}
                    headers={headers}
                >
                    <Map
                        list={payoutData?.data}
                        render={(item, i) => {
                            const paymentType = parseInt(item?.payment_type);
                            const fiscale = calcFiscale(item.amount);

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{i + rowStart}</TableCell>
                                    <TableCell>{item.user?.username}</TableCell>
                                    <TableCell>
                                        <Currency>{item.user_balance}</Currency>
                                    </TableCell>
                                    <TableCell>
                                        {getPayoutNameFromId(item.payment_type)}
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
                                        <ParseDate date={item.created_at} />
                                    </TableCell>
                                    <TableCell>
                                        <Currency>{item.amount}</Currency>
                                    </TableCell>
                                    <TableCell>
                                        <Currency>
                                            {item.admin_fee_deducted}
                                        </Currency>
                                    </TableCell>
                                    <TableCell>
                                        <Currency>
                                            {item.released_amount}
                                        </Currency>
                                    </TableCell>

                                    {/* Netto Stimato */}
                                    <TableCell>
                                        {fiscale ? (
                                            <Link
                                                component="button"
                                                variant="body2"
                                                onClick={() =>
                                                    handleOpenDetail(item)
                                                }
                                                sx={{
                                                    color: "#B8963B",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    textDecoration: "none",
                                                    "&:hover": {
                                                        textDecoration:
                                                            "underline",
                                                    },
                                                }}
                                            >
                                                €
                                                {fiscale.nettoStandard.toFixed(
                                                    2
                                                )}
                                            </Link>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                            <Ternary
                                                when={status.approve}
                                                then={
                                                    <Button
                                                        size="small"
                                                        onClick={approve(
                                                            item.id
                                                        )}
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
                                                        size="small"
                                                        onClick={reject(
                                                            item.id
                                                        )}
                                                        startIcon={
                                                            <Iconify icon="ant-design:delete-outlined" />
                                                        }
                                                        color="error"
                                                        variant="contained"
                                                        name="payout-reject"
                                                    >
                                                        <Translate>
                                                            financial.payout.admin.request.reject
                                                        </Translate>
                                                    </Button>
                                                }
                                            />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    />
                </DataHandlerTable>
            </Card>
            <PaginationButtons onChange={onChange} page={page} count={count} />

            {/* Fiscal Detail Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#FAF6EF",
                        borderBottom: "1px solid #E8DDCA",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#B8963B" }}
                    >
                        Dettaglio Fiscale — {dialogData?.username}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: "16px !important" }}>
                    {dialogData && (
                        <Box>
                            <FiscaleDetailRow
                                label="Lordo richiesto"
                                value={`€${dialogData.lordo.toFixed(2)}`}
                            />
                            <FiscaleDetailRow
                                label="Imponibile (78%)"
                                value={`€${dialogData.imponibile.toFixed(2)}`}
                            />

                            <Box
                                sx={{
                                    borderTop: "1px solid #E8DDCA",
                                    mt: 1,
                                    pt: 1,
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#7A6A5C",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Deduzioni
                                </Typography>
                            </Box>
                            <FiscaleDetailRow
                                label="Ritenuta d'acconto (23%)"
                                value={`−€${dialogData.ritenuta.toFixed(2)}`}
                                color="#C0392B"
                            />
                            <FiscaleDetailRow
                                label={`INPS standard (${(
                                    INPS_RATE_STANDARD * 100
                                ).toFixed(2)}%)`}
                                value={`−€${dialogData.inpsStandard.toFixed(
                                    2
                                )}`}
                                color="#C0392B"
                            />
                            {dialogData.bollo > 0 && (
                                <FiscaleDetailRow
                                    label="Bollo (importo ≥ €100)"
                                    value={`−€${dialogData.bollo.toFixed(2)}`}
                                    color="#C0392B"
                                />
                            )}

                            <Box
                                sx={{
                                    borderTop: "2px solid #E8DDCA",
                                    mt: 1.5,
                                    pt: 1.5,
                                }}
                            >
                                <FiscaleDetailRow
                                    label="Netto stimato"
                                    value={`€${dialogData.nettoStandard.toFixed(
                                        2
                                    )}`}
                                    color="#B8963B"
                                    bold
                                />
                            </Box>

                            {dialogData.lordo > SOGLIA_INPS && (
                                <Box
                                    sx={{
                                        backgroundColor: "#FFF3E0",
                                        borderRadius: 1,
                                        p: 1.5,
                                        mt: 2,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "#E65100" }}
                                    >
                                        Se il promoter ha superato la soglia
                                        INPS annua di €6.410, l'aliquota
                                        aumenta al 25.72% e il netto scende a{" "}
                                        <strong>
                                            €{dialogData.nettoHigh.toFixed(2)}
                                        </strong>
                                    </Typography>
                                </Box>
                            )}

                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    mt: 2,
                                    color: "text.secondary",
                                }}
                            >
                                Calcolo indicativo per incaricato occasionale.
                                INPS calcolata come 1/3 carico promoter.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Chiudi</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PayoutRequest;
