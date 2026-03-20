import { Collapse } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Coin from "src/components/coin";
import { TYPE_IDS } from "src/utils/types";

const Coins = ({ name }) => {
    const { watch } = useFormContext();

    const isCoinPayment = watch(name) === TYPE_IDS.coin;

    return (
        <Collapse in={isCoinPayment}>
            <Coin isCoinPayment={isCoinPayment} />
        </Collapse>
    );
};

export default Coins;
