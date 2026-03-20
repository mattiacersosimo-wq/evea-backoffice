import {
  Button,
  ButtonGroup,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useMemo, useEffect } from "react";
import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import { useTranslation } from "react-i18next";

const StatusDropdown = ({ item, fetchData, page }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const statusOptions = [
    { value: "finished", label: t("global.completed"), color: "#33cc33" },
    { value: "failed", label: t("global.failed"), color: "#e29f23" },
    { value: "refunded", label: t("global.refunded"), color: "#1968df" },
    { value: "cancelled", label: t("global.cancelled"), color: "#ff3333" },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatusName, setCurrentStatusName] = useState(
    item.payment_status,
  );

  useEffect(() => {
    setCurrentStatusName(item.payment_status);
  }, [item.payment_status]);

  const isDisabled = useMemo(
    () => currentStatusName !== "finished",
    [currentStatusName],
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const changeStatus = async (selected) => {
    if (isDisabled) return;
    setIsLoading(true);
    try {
      const { data, status } = await axiosInstance.get(
        `/api/admin/pending-reject-payment/${item.id}?payment_status=${selected}`,
      );
      if (status === 200) {
        enqueueSnackbar(data.message, { variant: "success" });
        setCurrentStatusName(selected);
        fetchData?.(page);
      }
      setAnchorEl(null);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to update status", { variant: "error" });
      setCurrentStatusName(item.payment_status);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStatus = useMemo(
    () => statusOptions.find((s) => s.value === currentStatusName),
    [currentStatusName],
  );

  return (
    <>
      <ButtonGroup
        variant="outlined"
        size="small"
        aria-label="status actions"
        sx={{ color: currentStatus?.color }}
      >
        <Button sx={{ color: currentStatus?.color }} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            currentStatus?.label
          )}
        </Button>
        <Button
          size="small"
          aria-haspopup="menu"
          onClick={handleMenuOpen}
          disabled={isLoading || isDisabled}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => changeStatus(option.value)}
            selected={currentStatusName === option.value}
            disabled={isLoading || currentStatusName === option.value}
            sx={{
              backgroundColor: option.color,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default StatusDropdown;
