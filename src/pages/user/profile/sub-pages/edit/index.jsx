import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Stack, TextField as MuiTextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import axiosInstance from "src/utils/axios";
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

const ChangeEmailDialog = ({ open, onClose, currentEmail }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [step, setStep] = useState(1); // 1=new email, 2=otp
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestOtp = async () => {
        if (!newEmail || !newEmail.includes("@")) { enqueueSnackbar(t("profile.edit_extra.enter_valid_email"), { variant: "error" }); return; }
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("api/request-email-change", { new_email: newEmail });
            if (data.status) { enqueueSnackbar(data.message, { variant: "success" }); setStep(2); }
            else enqueueSnackbar(data.message, { variant: "error" });
        } catch (err) { enqueueSnackbar(err?.response?.data?.message || t("common.error"), { variant: "error" }); }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (otp.length !== 6) { enqueueSnackbar(t("profile.edit_extra.enter_6_digit_code"), { variant: "error" }); return; }
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("api/verify-email-change", { otp });
            if (data.status) {
                enqueueSnackbar(data.message, { variant: "success" });
                onClose(true); // true = email changed
                setStep(1); setNewEmail(""); setOtp("");
            } else enqueueSnackbar(data.message, { variant: "error" });
        } catch (err) { enqueueSnackbar(err?.response?.data?.message || t("profile.edit_extra.invalid_code"), { variant: "error" }); }
        setLoading(false);
    };

    const handleClose = () => { onClose(false); setStep(1); setNewEmail(""); setOtp(""); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{t("profile.edit_extra.change_email_title")}</DialogTitle>
            <DialogContent>
                {step === 1 ? (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                            {t("profile.edit_extra.current_email")}: <b>{currentEmail}</b>
                        </Typography>
                        <MuiTextField fullWidth size="small" label={t("profile.edit_extra.new_email")} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        <Typography sx={{ fontSize: "0.75rem", color: "#999" }}>
                            {t("profile.edit_extra.verification_code_sent_hint")}
                        </Typography>
                    </Stack>
                ) : (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                            {t("profile.edit_extra.otp_sent_prefix")} <b>{currentEmail}</b>. {t("profile.edit_extra.otp_enter_below")}
                        </Typography>
                        <MuiTextField fullWidth size="small" label={t("profile.edit_extra.otp_code")} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            inputProps={{ maxLength: 6, style: { letterSpacing: 8, fontSize: "1.2rem", textAlign: "center", fontWeight: 700 } }} />
                        <Chip label={t("profile.edit_extra.new_email_chip", { email: newEmail })} size="small" sx={{ alignSelf: "flex-start" }} />
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleClose} sx={{ color: "#999", textTransform: "none" }}>{t("common.cancel")}</Button>
                {step === 1 ? (
                    <Button onClick={handleRequestOtp} variant="contained" disabled={loading} sx={{ textTransform: "none", bgcolor: "#B8963B", "&:hover": { bgcolor: "#9A7B2F" } }}>
                        {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : t("profile.edit_extra.send_code")}
                    </Button>
                ) : (
                    <Button onClick={handleVerify} variant="contained" disabled={loading} sx={{ textTransform: "none", bgcolor: "#B8963B", "&:hover": { bgcolor: "#9A7B2F" } }}>
                        {loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : t("profile.edit_extra.verify_and_change")}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

const CoHolderSection = () => {
    const { t } = useTranslation();
    const { control, register, setValue } = useFormContext();
    const hasCoHolder = useWatch({ control, name: "has_co_holder" });

    return (
        <Box sx={{ gridColumn: "1 / -1", mt: 1, p: 2, border: "1px solid #E5DCC9", borderRadius: 1, bgcolor: "#FAF7F0" }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={Boolean(hasCoHolder)}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setValue("has_co_holder", checked);
                            if (!checked) {
                                setValue("co_holder_first_name", "");
                                setValue("co_holder_last_name", "");
                                setValue("co_holder_date_of_birth", "");
                            }
                        }}
                        sx={{ color: "#B8963B", "&.Mui-checked": { color: "#B8963B" } }}
                    />
                }
                label={<Typography sx={{ fontWeight: 600 }}>{t("profile.edit_extra.co_holder_label")}</Typography>}
            />
            <Typography variant="caption" sx={{ display: "block", color: "#7A6A5C", mt: 0.5, fontSize: "0.75rem", fontStyle: "italic" }}>
                {t("profile.edit_extra.co_holder_hint")}
            </Typography>
            {hasCoHolder && (
                <Box sx={{ display: "grid", columnGap: 2, rowGap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, mt: 2 }}>
                    <RHFTextField name="co_holder_first_name" label={t("profile.edit_extra.co_holder_first_name")} />
                    <RHFTextField name="co_holder_last_name" label={t("profile.edit_extra.co_holder_last_name")} />
                    <RHFTextField
                        name="co_holder_date_of_birth"
                        label={t("profile.edit_extra.date_of_birth")}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            )}
            {/* keep RHF registration alive even when collapsed */}
            <input type="hidden" {...register("has_co_holder")} />
        </Box>
    );
};

const PartitaIvaFields = () => {
    const { t } = useTranslation();
    const { control } = useFormContext();
    const regime = useWatch({ control, name: "regime_fiscale" });

    if (regime !== "partita_iva") return null;

    return (
        <>
            <RHFTextField
                name="vat_number"
                label={t("profile.edit.vat_number")}
                InputLabelProps={{ shrink: true }}
            />
            <RHFTextField
                name="codice_sdi"
                label={t("profile.edit_extra.codice_sdi_label")}
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
    const HIDDEN_IDS = [1, 2, 3, 4, 5];

    if (HIDDEN_IDS.indexOf(id) < 0) {
        return <>{children}</>;
    }

    return null;
};

const EditInfo = () => {
    const { methods, onSubmit } = useUser();
    const { isAdmin, user } = useAuth();
    const onBlur = ({ target: { value, name } }) =>
        methods.setValue(name, value.trim());

    // Cliente puro: può modificare nome/cognome/username (nessun vincolo fiscale).
    // Promoter: bloccati perché legati al Codice Fiscale (INPS/IRPEF).
    const isCustomerOnly = Number(user?.is_customer) === 1 && Number(user?.is_promoter) === 0;

    // Real-time check disponibilità username (solo cliente puro).
    // Debounce 500ms; salta chiamata se username == quello attuale.
    const [usernameCheck, setUsernameCheck] = useState({ status: "idle", message: "" });
    const watchedUsername = useWatch({ control: methods.control, name: "username" });

    useEffect(() => {
        if (!isCustomerOnly) return;
        const trimmed = (watchedUsername || "").trim();
        if (!trimmed) { setUsernameCheck({ status: "idle", message: "" }); return; }
        if (trimmed === user?.username) { setUsernameCheck({ status: "current", message: t("profile.edit_extra.username_current") }); return; }
        if (!/^[a-zA-Z0-9]+$/.test(trimmed)) { setUsernameCheck({ status: "invalid", message: t("profile.edit_extra.username_invalid_chars") }); return; }
        if (trimmed.length < 3) { setUsernameCheck({ status: "invalid", message: t("profile.edit_extra.username_min_length") }); return; }

        setUsernameCheck({ status: "checking", message: t("profile.edit_extra.username_checking") });
        const timer = setTimeout(async () => {
            try {
                const { data } = await axiosInstance.post("/api/wp/validate-username", { username: trimmed });
                if (data?.available) {
                    setUsernameCheck({ status: "available", message: t("profile.edit_extra.username_available", { username: trimmed }) });
                } else {
                    setUsernameCheck({ status: "taken", message: t("profile.edit_extra.username_taken") });
                }
            } catch (e) {
                setUsernameCheck({ status: "idle", message: "" });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [watchedUsername, user?.username, isCustomerOnly, methods.control]);

    const usernameBlocksSubmit = usernameCheck.status === "taken" || usernameCheck.status === "invalid" || usernameCheck.status === "checking";

    const { t } = useTranslation();
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);

    const fields = useFields();

    const handleEmailChanged = (changed) => {
        setEmailDialogOpen(false);
        if (changed) window.location.reload();
    };

    const handleDownloadLetter = () => {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
        const baseUrl = (axiosInstance.defaults.baseURL || "").replace(/\/$/, "");
        window.open(`${baseUrl}/api/download-letter?token=${encodeURIComponent(token)}`, "_blank");
    };

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
                            {(isAdmin || isCustomerOnly) && (
                                <RHFTextField
                                    name="username"
                                    label={"profile.username"}
                                    onBlur={onBlur}
                                    error={isCustomerOnly && (usernameCheck.status === "taken" || usernameCheck.status === "invalid")}
                                    helperText={
                                        isCustomerOnly
                                            ? (usernameCheck.message || t("profile.edit_extra.username_help"))
                                            : undefined
                                    }
                                    InputProps={{
                                        endAdornment: isCustomerOnly ? (
                                            usernameCheck.status === "checking" ? (
                                                <CircularProgress size={18} sx={{ color: "#B8963B" }} />
                                            ) : usernameCheck.status === "available" ? (
                                                <Iconify icon="mdi:check-circle" width={20} sx={{ color: "#27500A" }} />
                                            ) : usernameCheck.status === "taken" ? (
                                                <Iconify icon="mdi:close-circle" width={20} sx={{ color: "#c62828" }} />
                                            ) : usernameCheck.status === "invalid" ? (
                                                <Iconify icon="mdi:alert-circle" width={20} sx={{ color: "#F57F17" }} />
                                            ) : usernameCheck.status === "current" ? (
                                                <Iconify icon="mdi:information-outline" width={20} sx={{ color: "#7A6A5C" }} />
                                            ) : null
                                        ) : null,
                                    }}
                                />
                            )}

                            <RHFTextField
                                name="first_name"
                                label="profile.edit.first_name"
                                onBlur={onBlur}
                                disabled={!isCustomerOnly}
                                helperText={isCustomerOnly ? undefined : t("profile.edit_extra.fixed_by_onboarding_cf")}
                            />
                            <RHFTextField
                                name="last_name"
                                label="profile.edit.last_name"
                                onBlur={onBlur}
                                disabled={!isCustomerOnly}
                                helperText={isCustomerOnly ? undefined : t("profile.edit_extra.fixed_by_onboarding_cf")}
                            />

                            <RHFTextField
                                name="date_of_birth"
                                label={t("profile.edit_extra.date_of_birth")}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                disabled
                                helperText={t("profile.edit_extra.fixed_by_onboarding_cf")}
                            />
                            <Countries type="alpha_2" />

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

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#7A6A5C",
                                    gridColumn: "1 / -1",
                                    mt: -2,
                                    fontSize: "0.7rem",
                                }}
                            >
                                {t("profile.edit_extra.address_updated_shopify")}
                            </Typography>

                            <RHFTextField
                                name="codice_fiscale"
                                label="profile.edit.tax_code"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{ maxLength: 16, style: { textTransform: "uppercase" } }}
                                disabled
                                helperText={t("profile.edit_extra.fixed_by_onboarding_irpef")}
                            />

                            {/* Co-intestatario: solo promoter — e' informazione */}
                            {/* legata alla lettera d'incarico, non applicabile ai customer. */}
                            {user?.is_promoter === 1 && <CoHolderSection />}

                            {user?.is_promoter === 1 && (
                            <>
                            <RHFSelect
                                name="regime_fiscale"
                                label={t("profile.edit_extra.regime_fiscale")}
                            >
                                <option value="incaricato_occasionale">
                                    {t("profile.edit_extra.incaricato_occasionale")}
                                </option>
                                <option value="partita_iva">
                                    {t("profile.edit.vat_number")}
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
                                {t("profile.edit_extra.partita_iva_hint")}
                            </Typography>
                            </>
                            )}


                            <Map
                                list={fields}
                                render={({
                                    id,
                                    input_label,
                                    input_type,
                                    input_name,
                                    input_options,
                                }) => input_name === "email" ? (
                                        <Stack direction="row" spacing={1} alignItems="flex-start">
                                            <RHFTextField
                                                name="email"
                                                label={input_label}
                                                disabled
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ flex: 1 }}
                                            />
                                            <Button
                                                size="small"
                                                onClick={() => setEmailDialogOpen(true)}
                                                sx={{ mt: 1, textTransform: "none", color: "#B8963B", fontWeight: 600, whiteSpace: "nowrap" }}
                                                startIcon={<Iconify icon="mdi:email-edit-outline" width={16} />}
                                            >
                                                {t("profile.edit_extra.change_button")}
                                            </Button>
                                        </Stack>
                                    ) : (
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
                                disabled={usernameBlocksSubmit}
                                name="save"
                            >
                                <Translate>profile.edit.update</Translate>
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
            <ChangeEmailDialog open={emailDialogOpen} onClose={handleEmailChanged} currentEmail={user?.email || methods.getValues("email")} />
        </FormProvider>
    );
};

export default EditInfo;
