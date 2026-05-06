import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";

const ORO = "#B8963B";

/**
 * Piccolo IconButton che copia un codice negli appunti.
 * Da usare accanto ai code coupon (3FF, ROB, gift card, ecc.).
 *
 * Props:
 *   code: string — testo da copiare
 *   size?: "small" (default) | "tiny" (16px)
 *   color?: HEX — colore icona (default oro)
 */
export default function CopyCouponButton({ code, size = "small", color = ORO }) {
  const { enqueueSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const onCopy = async (e) => {
    e?.stopPropagation?.();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      enqueueSnackbar(`Codice ${code} copiato`, { variant: "success", autoHideDuration: 1800 });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      enqueueSnackbar("Impossibile copiare", { variant: "error" });
    }
  };

  const iconSize = size === "tiny" ? 14 : 18;
  const btnPad = size === "tiny" ? 0.3 : 0.5;

  return (
    <Tooltip title={copied ? "Copiato!" : "Copia codice"} placement="top" arrow>
      <IconButton
        onClick={onCopy}
        size="small"
        sx={{ p: btnPad, color, "&:hover": { bgcolor: `${color}1f` } }}
        aria-label="copy coupon code"
      >
        <Iconify icon={copied ? "mdi:check" : "mdi:content-copy"} width={iconSize} />
      </IconButton>
    </Tooltip>
  );
}
