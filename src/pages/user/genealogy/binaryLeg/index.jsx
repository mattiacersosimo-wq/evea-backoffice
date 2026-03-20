import {
    Box,
    Button,
    Card,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { upperCase } from "lodash";
import React, { useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import { useTranslation } from "react-i18next";
import Translate from "src/components/translate";
import { PATH_USER } from "src/routes/paths";
import useFetchBinaryLeg from "./hooks/useFetchBinaryLeg";
import useUpdateBinaryLeg from "./hooks/useUpdateBinaryLeg";

const getLabel = (selected) => {
    switch (selected) {
        case "left": {
            return "left";
        }
        case "right": {
            return "right";
        }
        case "referrals": {
            return "referrals";
        }
        case "points": {
            return "points";
        }
        case "holding": {
            return "holding";
        }
    }
};

const BinaryLeg = () => {
    const theme = useTheme();
    const { data, setData } = useFetchBinaryLeg();
    const onSubmit = useUpdateBinaryLeg(data);

    const { t } = useTranslation();
    return (
        <Page title="genealogy.leg_settings.title">
            <HeaderBreadcrumbs
                heading="genealogy.leg_settings.title"
                links={[
                    { name: "global.dashboard", href: PATH_USER.root },
                    { name: "genealogy.leg_settings.title" },
                ]}
            />

            <Card>
                <Stack sx={{ width: "fit-content", padding: 3 }} spacing={3}>
                    <Stack
                        sx={{
                            width: "fit-content",
                        }}
                        spacing={2}
                    >
                        <FormControl>
                            <Stack spacing={2}>
                                <FormLabel id="demo-radio-buttons-group-label">
                                    <Button
                                        disableRipple
                                        size="small"
                                        sx={{
                                            color: theme.palette.grey.A700,
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                            },
                                        }}
                                        name="current-leg"
                                    >
                                        <Translate>
                                            genealogy.leg_settings.current_leg
                                        </Translate>{" "}
                                        :
                                        <p>
                                            {" "}
                                            <Translate>
                                                genealogy.leg_settings.base_on
                                            </Translate>{" "}
                                            {upperCase(getLabel(data))}
                                        </p>
                                    </Button>
                                </FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={data}
                                    name="radio-buttons-group"
                                    onChange={(e) => setData(e.target.value)}
                                >
                                    <FormControlLabel
                                        sx={{ marginBottom: "0.3rem" }}
                                        value="points"
                                        control={<Radio size="small" />}
                                        label={t("genealogy.leg_settings.bp")}
                                    />
                                    <FormControlLabel
                                        sx={{ marginBottom: "0.3rem" }}
                                        value="referrals"
                                        control={<Radio size="small" />}
                                        label={t("genealogy.leg_settings.br")}
                                    />
                                    <FormControlLabel
                                        sx={{ marginBottom: "0.3rem" }}
                                        value="left"
                                        control={<Radio size="small" />}
                                        label={t("genealogy.leg_settings.lr")}
                                    />

                                    <FormControlLabel
                                        sx={{ marginBottom: "0.3rem" }}
                                        value="right"
                                        control={<Radio size="small" />}
                                        label={t("genealogy.leg_settings.rr")}
                                    />
                                    <FormControlLabel
                                        sx={{ marginBottom: "0.3rem" }}
                                        value="holding"
                                        control={<Radio size="small" />}
                                        label={t(
                                            "genealogy.leg_settings.holding"
                                        )}
                                    />
                                </RadioGroup>
                            </Stack>
                        </FormControl>
                        <Box>
                            <Button
                                variant="contained"
                                type="submit"
                                onClick={onSubmit}
                                name="save"
                            >
                                <Translate>settings.brand.save</Translate>
                            </Button>
                        </Box>
                    </Stack>
                </Stack>
            </Card>
        </Page>
    );
};

export default BinaryLeg;
