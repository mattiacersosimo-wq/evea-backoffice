import { ListItemIcon, ListItemText, MenuItem, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButtonAnimate } from "src/components/animate";
import MenuPopover from "src/components/MenuPopover";
import LANGS from "src/hooks/LANGS";
import useAuth from "src/hooks/useAuth";
import useSettings from "src/hooks/useSettings";
import axiosInstance from "src/utils/axios";

export default function LanguagePopover() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { updateDirection } = useSettings();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const currentLang = useMemo(() => {
    return LANGS.find(({ value }) => value === i18n.resolvedLanguage);
  }, [i18n.resolvedLanguage]);

  const onClick = async (locale) => {
    if (!user) {
      i18n.changeLanguage(locale);
      return;
    }
    try {
      const reqData = new FormData();
      reqData.append("language", locale);
      reqData.append("_method", "PUT");
      const { data } = await axiosInstance.post("api/language-update", reqData);
      if (data.status) {
        if (locale === "ar") {
          updateDirection("rtl");
        } else {
          updateDirection("ltr");
        }
        i18n.changeLanguage(locale);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && { bgcolor: "action.selected" }),
        }}
      >
        <img disabledEffect src={currentLang?.icon} alt={currentLang?.label} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Stack spacing={0.75}>
          {LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang?.value}
              onClick={() => {
                onClick(option.value);
                handleClose();
              }}
            >
              <ListItemIcon>
                <img
                  disabledEffect
                  alt={option.label}
                  src={option.icon}
                  sx={{ width: 28, mr: 2, borderRadius: 0.3 }}
                />
              </ListItemIcon>

              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
