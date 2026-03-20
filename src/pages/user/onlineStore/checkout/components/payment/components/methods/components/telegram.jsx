import { Box, TextField } from "@mui/material";
import { use } from "i18next";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import useAuth from "src/hooks/useAuth";

const Telegram = ({ showTelegram }) => {
  const { user } = useAuth();
  const { setValue } = useFormContext();
  useEffect(() => {
    const { user_profile } = user;
    const { first_name, last_name, telegram } = user_profile || {};
    setValue("first_name", first_name);
    setValue("last_name", last_name);
    setValue("telegram", telegram || "");
    setValue("profile_update", showTelegram ? 1 : 0);
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        columnGap: 2,
        rowGap: 2,
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          columnGap: 2,
        }}
      >
        <RHFTextField label="First Name" name="first_name" />
        <RHFTextField label="Last Name" name="last_name" />
      </Box>
      <RHFTextField label="Telegram" name="telegram" />
    </Box>
  );
};

export default Telegram;
