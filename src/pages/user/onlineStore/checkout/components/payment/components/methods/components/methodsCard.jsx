import { Box, Card, FormControlLabel, Radio, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import TYPES, { TYPE_IDS } from "src/utils/types";
import Coins from "./Coins";
import FinPay from "./finPay";
import Paypal from "./paypal";
import Stripe from "./stripe";
import TransactionReferenceNumber from "./transaction-reference-number";

const MethodsCardWrapper = styled(Card)(({ theme }) => ({
    padding: theme.spacing(0, 2.5),
    justifyContent: "space-between",
    transition: theme.transitions.create("all"),
    border: `solid 1px ${theme.palette.divider}`,
}));

const MethodsCard = ({
    name,
    value,
    label,
    selectPayment,
    image,
    depositWalletBalance,
    bankDetails,
}) => {
    return (
        <MethodsCardWrapper onClick={() => selectPayment(value)}>
            <FormControlLabel
                value={value}
                control={
                    <Radio
                        checkedIcon={
                            <Iconify icon={"eva:checkmark-circle-2-fill"} />
                        }
                    />
                }
                label={
                    <Box
                        sx={{
                            ml: 1,
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            "& MuiTypography-root": {
                                width: "100%",
                            },
                        }}
                    >
                        <Ternary
                            when={image}
                            then={
                                <img
                                    src={image}
                                    style={{ width: 80, height: "auto" }}
                                />
                            }
                        />
                        <Box>
                            <Typography variant="subtitle2">{label}</Typography>
                            <Ternary
                                when={TYPE_IDS.wallet === value}
                                then={
                                    <Typography variant="caption">
                                        <Translate>
                                            user.online_store.product.balance
                                        </Translate>{" "}
                                        :{" "}
                                        <Currency>
                                            {depositWalletBalance}
                                        </Currency>
                                    </Typography>
                                }
                            />
                        </Box>
                    </Box>
                }
                sx={{
                    flexGrow: 1,
                    py: 3,
                    width: "100%",
                }}
            />

            <Ternary
                when={value === TYPE_IDS.finPay}
                then={<FinPay name={name} />}
            />

            <Ternary
                when={value === TYPE_IDS.bankPayment}
                then={
                    <TransactionReferenceNumber
                        bankDetails={bankDetails}
                        name={name}
                    />
                }
            />

            <Ternary
                when={value === TYPE_IDS.coin}
                then={<Coins name={name} />}
            />

            <Ternary
                when={value === TYPE_IDS.stripe}
                then={<Stripe name={name} />}
            />
            <Ternary
                when={
                    value === TYPE_IDS.paypal || value === TYPE_IDS.paypalBTaf
                }
                then={<Paypal name={name} />}
            />
        </MethodsCardWrapper>
    );
};

MethodsCard.propTypes = {
    value: PropTypes.oneOf(Object.values(TYPES)).isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default MethodsCard;
