import { Badge, IconButton } from "@mui/material";
import Iconify from "src/components/Iconify";
import { ACCOUNT_URL } from "src/config";

export default function ShopToken() {
  const handleClick = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      window.open(ACCOUNT_URL, "_blank");
    } else {
    }
  };

  return (
    <IconButton type="button" onClick={handleClick}>
      <Badge color="error">
        <Iconify icon="mdi:shopping" width={20} height={20} />
      </Badge>
    </IconButton>
  );
}
