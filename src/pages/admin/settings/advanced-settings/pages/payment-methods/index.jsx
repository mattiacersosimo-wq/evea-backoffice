import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import Map from "src/components/map";
import Ternary from "src/components/ternary";

import Translate from "src/components/translate";
import { TYPE_IDS } from "src/utils/types";
import UpdateBankDetails from "./components/update-bank-details";
import UpdateBitabsDetails from "./components/update-bitabs-details";
import useGetPaymentTypes from "./hooks/use-get-payment-types";

const PaymentMethods = () => {
    const {
        loading,
        onSubmit,
        methods,
        updateMethods,
        updateRecurring,
        getData,
    } = useGetPaymentTypes();

    const selectedAtLeastOne = useMemo(
        () => Boolean(methods.reduce((acc, { active }) => acc || active, 0)),
        [methods]
    );

    const [openBitabsDetails, setOpenBitabsDetails] = useState(false);
    const [openBankDetails, setOpenBankDetails] = useState(false);

    const bitabsDetails = useMemo(() => {
        if (openBitabsDetails) {
            const selectedMethod = methods.find(
                ({ id }) => id === TYPE_IDS.bitaps
            );
            return (
                {
                    id: selectedMethod.id,
                    wallet_address: selectedMethod.wallet_address,
                } || null
            );
        }
    }, [openBitabsDetails]);

    return (
        <Box>
            <Card sx={{ p: 2, minHeight: "300px" }}>
                <Typography variant="h6" gutterBottom mb={5}>
                    <Translate>network_members.choose_payments</Translate>
                </Typography>

                <Ternary
                    when={methods.length === 0}
                    then={
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    }
                    otherwise={
                        <>
                            <FormGroup>
                                <Grid
                                    container
                                    spacing={2}
                                    sx={{
                                        width: {
                                            xl: "60%",
                                            lg: "75%",
                                            xs: "100%",
                                        },
                                    }}
                                >
                                    <Map
                                        list={methods}
                                        render={({
                                            name,
                                            active,
                                            id,
                                            is_recurring,
                                            image,
                                        }) => {
                                            return (
                                                <Grid item sm={6} xs={12}>
                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            p: 1.5,
                                                            height: 100,
                                                        }}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={1.5}
                                                            justifyContent="space-between"
                                                        >
                                                            <Stack>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            onClick={updateMethods(
                                                                                id
                                                                            )}
                                                                            checked={
                                                                                active
                                                                            }
                                                                        />
                                                                    }
                                                                    label={name}
                                                                />

                                                                <Ternary
                                                                    when={
                                                                        id ===
                                                                        TYPE_IDS.bankPayment
                                                                    }
                                                                    then={
                                                                        <Button
                                                                            onClick={() =>
                                                                                setOpenBankDetails(
                                                                                    true
                                                                                )
                                                                            }
                                                                            size="small"
                                                                            variant="contained"
                                                                        >
                                                                            <Translate>
                                                                                global.update
                                                                            </Translate>
                                                                        </Button>
                                                                    }
                                                                />
                                                                <Ternary
                                                                    when={
                                                                        id ===
                                                                        TYPE_IDS.bitaps
                                                                    }
                                                                    then={
                                                                        <Button
                                                                            onClick={() =>
                                                                                setOpenBitabsDetails(
                                                                                    true
                                                                                )
                                                                            }
                                                                            size="small"
                                                                            variant="contained"
                                                                        >
                                                                            <Translate>
                                                                                global.update
                                                                            </Translate>
                                                                        </Button>
                                                                    }
                                                                />
                                                                <Ternary
                                                                    when={
                                                                        is_recurring !==
                                                                        null
                                                                    }
                                                                    then={
                                                                        <FormControlLabel
                                                                            sx={{
                                                                                ml: 3,
                                                                            }}
                                                                            labelPlacement="start"
                                                                            control={
                                                                                <Switch
                                                                                    onClick={updateRecurring(
                                                                                        id
                                                                                    )}
                                                                                    checked={
                                                                                        is_recurring
                                                                                    }
                                                                                />
                                                                            }
                                                                            label={
                                                                                <Translate>
                                                                                    global.enable_recurring
                                                                                </Translate>
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                            </Stack>
                                                            <Box>
                                                                <img
                                                                    src={image}
                                                                />
                                                            </Box>
                                                        </Stack>
                                                    </Paper>
                                                </Grid>
                                            );
                                        }}
                                    />
                                </Grid>
                            </FormGroup>
                            <LoadingButton
                                sx={{
                                    mt: 2,
                                }}
                                disabled={!selectedAtLeastOne}
                                variant="contained"
                                onClick={onSubmit}
                                loading={loading}
                            >
                                <Translate>network_members.update</Translate>
                            </LoadingButton>
                        </>
                    }
                />
            </Card>
            <UpdateBitabsDetails
                open={openBitabsDetails}
                onClose={() => setOpenBitabsDetails(false)}
                details={bitabsDetails}
                getData={getData}
            />
            <UpdateBankDetails
                open={openBankDetails}
                onClose={() => setOpenBankDetails(false)}
            />
        </Box>
    );
};

export default PaymentMethods;
