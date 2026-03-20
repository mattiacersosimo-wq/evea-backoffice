import { Autocomplete, TextField } from "@mui/material";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useGetHoldingTankReferrals from "./hooks/use-get-holding-tank-referrals";

const ReferralUsers = () => {
    const holdingTankReferrals = useGetHoldingTankReferrals();
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();
    const { t } = useTranslation();
    const selectedUserId = watch("user_id");
    const selectedUser = useMemo(() => {
        return (
            holdingTankReferrals.find(
                ({ user_id }) => user_id === selectedUserId
            ) || null
        );
    }, [selectedUserId]);

    return (
        <Autocomplete
            value={selectedUser}
            options={holdingTankReferrals}
            getOptionLabel={(v) => v?.user?.username}
            onChange={(_, v) => {
                setValue("user_id", v ? v.user_id : null);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t("search.user")}
                    error={Boolean(errors.user_id)}
                    helperText={errors?.user_id?.message}
                />
            )}
        />
    );
};

export default ReferralUsers;
