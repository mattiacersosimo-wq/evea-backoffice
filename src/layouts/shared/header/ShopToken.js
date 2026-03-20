import { Badge, IconButton } from "@mui/material";
import Iconify from "src/components/Iconify";
import { WP_URL } from "src/config";

export default function ShopToken() {
  const handleClick = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // const redirectUrl = `${WP_URL}/wp-json/custom-login/v1/login?token=${accessToken}`;
      const redirectUrl = `https://account.myevea.com/`;
      window.open(redirectUrl, "_blank");
    } else {
      console.error("Access token not found");
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
