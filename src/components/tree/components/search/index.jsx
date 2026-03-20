import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import useQueryParams from "src/hooks/useQueryParams";

const SearchByUser = ({ search, handleReset }) => {
  const [username, setUsername] = useState("");
  const onChange = (e) => {
    setUsername(e.target.value);
  };

  const { deleteParam } = useQueryParams();

  const [searching, setSearching] = useState(false);
  const [resetting, setResetting] = useState(false);

  const searchUser = async () => {
    if (handleReset) handleReset();
    setSearching(true);
    try {
      await search(username, true);
      setSearching(false);
    } catch (err) {
      console.error(err);
      setSearching(false);
    }
  };

  const reset = async () => {
    if (handleReset) handleReset();
    setResetting(true);
    deleteParam("uname");
    setUsername("");
    try {
      await search(null, true);
      setResetting(false);
    } catch (err) {
      console.error(err);
      setResetting(false);
    }
  };
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        width: { lg: "60%", xs: "100%" },
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          width: { sm: "auto", xs: "100%" },
          pt: 1,
        }}
      >
        <TextField
          value={username}
          size="small"
          label={t("search.user")}
          onChange={onChange}
          sx={{ width: "100%" }}
        />
      </Box>
      <Box sx={{ display: "flex", width: { sm: "auto", xs: "100%" }, pt: 1 }}>
        <LoadingButton
          variant="contained"
          loading={searching}
          onClick={searchUser}
          sx={{ mr: "10px", ml: { sm: "0", xs: "-12px" } }}
        >
          <Translate>search.user</Translate>
        </LoadingButton>

        <LoadingButton
          loading={resetting}
          endIcon={<Iconify icon="bx:reset" />}
          variant="outlined"
          onClick={reset}
          size="small"
        >
          <Translate>global.reset</Translate>
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default SearchByUser;
