import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Image from "src/components/Image";
import Loop from "src/components/loop";
import useFetchCoin from "./hooks/useCoin";

const Coin = ({ isCoinPayment }) => {
    const coins = useFetchCoin();
    const { watch, setValue } = useFormContext();
    const selectedCoin = watch("coin_type");

    useEffect(() => {
        if (isCoinPayment) {
            if (coins.length > 0) {
                setValue("coin_type", coins[0]?.coin);
            }
            return;
        }

        setValue("coin_type", "");
    }, [isCoinPayment]);

    return (
        <Box
            display="grid"
            sx={{
                mb: 2.5,
                columnGap: 2,
                rowGap: 2,
                gridTemplateColumns: {
                    xs: "repeat(1,1fr)",
                    sm: "repeat(2,1fr)",
                },
            }}
        >
            <Loop
                list={coins}
                render={({ coin, image }, i) => (
                    <Box key={i}>
                        <Button
                            fullWidth
                            size="large"
                            variant={
                                coin === selectedCoin ? "contained" : "outlined"
                            }
                            startIcon={
                                <Image
                                    src={image}
                                    sx={{
                                        mr: 1,
                                        width: 25,
                                        height: 25,
                                        position: "relative",
                                        filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.24))",
                                    }}
                                />
                            }
                            onClick={() => setValue("coin_type", coin)}
                            sx={{ justifyContent: "flex-start" }}
                        >
                            {coin}
                        </Button>
                    </Box>
                )}
            />
        </Box>
    );
};

export default Coin;
