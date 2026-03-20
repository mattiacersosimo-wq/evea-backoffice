import { Box, Stack, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import Ternary from "src/components/ternary";
import Icons from "./icons";
import Test from "./test";

const LeftPane = ({ open }) => {
    return (
        <Box
            width="100%"
            sx={{
                borderRadius: "10px",
                backgroundColor: "primary.main",
                position: "relative",
                overflow: "hidden",
                height: "100%",
            }}
        >
            <Ternary when={open} then={<Test />} />

            <Box
                width="100%"
                sx={{
                    padding: 3,
                    height: "100%",
                    // backgroundImage: "url(/assets/about.png)",
                    color: "white",
                }}
            >
                <Typography color="white" variant="h4">
                    Contact Information
                </Typography>
                <Typography color="white" variant="caption" fontWeight={600}>
                    Fill up the Form and our Team will get back to you in 24
                    hours.
                </Typography>
                <Stack spacing={4} marginTop={6}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Iconify
                            icon="material-symbols:mail"
                            sx={{
                                fontSize: "1.5rem",
                            }}
                        />

                        <Stack>
                            <Typography>sales@cloudmlmsoftware.com</Typography>
                            <Typography>info@cloudmlmsoftware.com</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={3} alignItems="center">
                        <Iconify
                            icon="mdi:location"
                            sx={{
                                fontSize: "3.5rem",
                            }}
                        />
                        <Typography>
                            Unit 1A, 4th floor, KSITIL, Special Economic Zone,
                            Cyberpark Campus, Sahya building, Nillikkode P.O,
                            Kerala 673016
                        </Typography>
                    </Stack>
                </Stack>
                <Icons />
            </Box>
        </Box>
    );
};

export default LeftPane;
