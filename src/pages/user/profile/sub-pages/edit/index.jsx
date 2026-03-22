import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
} from "src/components/hook-form";

import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ShowForAdmin from "src/components/authentication-helpers/show-for-admin";
import Map from "src/components/map";
import Translate from "src/components/translate";
import useAuth from "src/hooks/useAuth";
import PickField from "src/sections/auth/register/components/pick-fields";
import useFields from "src/sections/auth/register/hooks/use-fields";
import Countries from "../../../../../components/countries";
import ProfilePicture from "./components/ProfilePicture";
import useUser from "./hooks/useUser";

const PartitaIvaFields = () => {
    const { control } = useFormContext();
    const regime = useWatch({ control, name: "regime_fiscale" });

    if (regime !== "partita_iva") return null;

    return (
        <>
            <RHFTextField
                name="vat_number"
                label="Partita IVA"
                InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
                name="codice_sdi"
                label="Codice SDI (7 caratteri)"
                inputProps={{ maxLength: 7 }}
            />
            <RHFTextField
                name="pec"
                label="PEC"
            />
        </>
    );
};

const HideComponent = ({ id, children }) => {
    const HIDDEN_IDS = [1, 2, 3, 4];

    if (HIDDEN_IDS.indexOf(id) < 0) {
        return <>{children}</>;
    }

    return null;
};

const EditInfo = () => {
    const { methods, onSubmit } = useUser();
    const { isAdmin } = useAuth();
    const onBlur = ({ target: { value, name } }) =>
        methods.setValue(name, value.trim());

    const { t } = useTranslation();

    const fields = useFields();

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ py: 10, px: 3 }}>
                        <ProfilePicture methods={methods} />
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: "grid",
                                columnGap: 2,
                                rowGap: 3,
                                gridTemplateColumns: {
                                    xs: "repeat(1, 1fr)",
                                    sm: "repeat(2, 1fr)",
                                },
                            }}
                        >
                            <ShowForAdmin>
                                <RHFTextField
                                    name="username"
                                    label={"profile.username"}
                                    onBlur={onBlur}
                                />
                            </ShowForAdmin>

                            <RHFTextField
                                name="first_name"
                                label="profile.edit.first_name"
                                onBlur={onBlur}
                            />
                            <RHFTextField
                                name="last_name"
                                label="profile.edit.last_name"
                                onBlur={onBlur}
                            />

                            <Countries />

                            <RHFTextField
                                name="state"
                                label="profile.edit.state"
                            />
                            <RHFTextField
                                name="city"
                                label="profile.edit.city"
                            />
                            <RHFTextField
                                name="zipcode"
                                label="profile.edit.pin"
                            />
                            <RHFTextField
                                name="address"
                                label="profile.edit.address"
                            />
                            {/*<Mobile />*/}

                            <RHFTextField
                                name="tax_code"
                                label="profile.edit.tax_code"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <RHFSelect
                                name="regime_fiscale"
                                label="Regime Fiscale"
                            >
                                <option value="incaricato_occasionale">
                                    Incaricato Occasionale
                                </option>
                                <option value="partita_iva">
                                    Partita IVA
                                </option>
                            </RHFSelect>

                            <PartitaIvaFields />

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    gridColumn: "1 / -1",
                                    mt: -2,
                                }}
                            >
                                Se hai Partita IVA, compila anche Partita IVA, Codice SDI e
                                PEC per la fatturazione elettronica
                            </Typography>

                            <RHFTextField
                                name="email"
                                label="profile.edit.mail"
                                disabled={isAdmin ? false : true}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <Map
                                list={fields}
                                render={({
                                    id,
                                    input_label,
                                    input_type,
                                    input_name,
                                    input_options,
                                }) => (
                                    <HideComponent id={id}>
                                        <PickField
                                            key={input_name}
                                            label={input_label}
                                            name={input_name}
                                            type={input_type}
                                            inputOptions={input_options}
                                        />
                                    </HideComponent>
                                )}
                            />

                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={methods.formState.isSubmitting}
                                name="save"
                            >
                                <Translate>profile.edit.update</Translate>
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
};

export default EditInfo;
