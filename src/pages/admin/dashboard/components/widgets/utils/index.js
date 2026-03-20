import { alpha } from "@mui/material/styles";

export const findGrowthRate = (prev, current) => {
  if (prev > 0)
    return Math.trunc(((parseInt(current) - parseInt(prev)) / prev) * 100) || 0;

  return 0;
};

export const genLabel = (rate) => {
  if (rate < 0) {
    return `${rate} %`;
  } else {
    return `${rate} %`;
  }
};

export const getColor = (growthRate) => {
  if (growthRate < 0) return "error.main";
  if (growthRate > 0) return "success.main";
  return "info.main";
};

export const getIcon = (growthRate) => {
  if (growthRate < 0) return "eva:trending-down-fill";
  if (growthRate > 0) return "eva:trending-up-fill";
  return null;
};

export const genBgColor = (growthRate) => (theme) => {
  let color = theme.palette.info.main;
  if (growthRate < 0) {
    color = theme.palette.error.main;
  }
  if (growthRate > 0) {
    color = theme.palette.success.main;
  }
  return alpha(color, 0.16);
};
