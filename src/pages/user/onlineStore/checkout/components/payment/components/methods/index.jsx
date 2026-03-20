import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    RadioGroup,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import Loop from "src/components/loop";
import Ternary from "src/components/ternary";
import useTimeOut from "src/components/timeout/hooks/useTimeOut";

import Translate from "src/components/translate";
import { TYPE_IDS } from "src/utils/types";
import { usePurchaseData } from "../../../../store/purchaseStore";
import MethodsCard from "./components/methodsCard";

const Methods = ({
    name = "payment_code",
    bankDetails,
    paymentMethods,
    depositWalletBalance,
}) => {
    const paymentCode = useRef(null);
    const { watch, setValue, getValues } = useFormContext();

    const { total_amount: total } = usePurchaseData() || {};

    const selectPayment = (v) => {
        if (v === getValues(name)) return;
        setValue(name, v);
        paymentCode.current = v;
    };

    useEffect(() => {
        if (total === 0) {
            setValue(name, TYPE_IDS.hundredPercentage);
            paymentCode.current = TYPE_IDS.hundredPercentage;
        }
    }, [total]);

    const selected = watch(name);

    const [timeout] = useTimeOut(paymentMethods?.length);

    useEffect(() => {
        if (paymentMethods?.length > 0) {
            if (paymentCode.current) {
                setValue(name, paymentCode.current);
                return;
            }
            const firstId = paymentMethods.find(Boolean)?.id;
            paymentCode.current = firstId;
            setValue(name, firstId);
        }
    }, [paymentMethods]);

    return (
        <>
            <Card sx={{ my: 3 }}>
                <CardHeader
                    title={
                        <Typography variant="subtitle2">
                            <Translate>
                                user.online_store.product.payment_options
                            </Translate>{" "}
                        </Typography>
                    }
                />
                <CardContent>
                    <Ternary
                        when={Boolean(paymentMethods?.length)}
                        then={
                            <>
                                <RadioGroup row value={selected}>
                                    <Stack
                                        spacing={2}
                                        sx={{
                                            width: "100%",
                                        }}
                                    >
                                        <Loop
                                            list={paymentMethods}
                                            render={({
                                                name: label,
                                                id,
                                                image,
                                            }) => (
                                                <MethodsCard
                                                    name={name}
                                                    depositWalletBalance={
                                                        depositWalletBalance
                                                    }
                                                    bankDetails={bankDetails}
                                                    image={image}
                                                    selectPayment={
                                                        selectPayment
                                                    }
                                                    key={id}
                                                    label={label}
                                                    value={id}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </RadioGroup>
                            </>
                        }
                        otherwise={
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Ternary
                                    when={timeout}
                                    then={
                                        <Typography variant="h5">
                                            No payment available for now please
                                            contact admin
                                        </Typography>
                                    }
                                    otherwise={<CircularProgress />}
                                />
                            </Box>
                        }
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default Methods;
