import {
  CardHeader,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import Ternary from "src/components/ternary";
import { PATH_USER } from "src/routes/paths";
import buildPath from "src/utils/build-path";
import icons from "src/utils/icons";
import Toggle from "./Toggle";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

const HeaderSection = ({ onChange, active, name, productUrl }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();
  const copy = () => {
    try {
      const URI = buildPath(
        window.location.origin,
        isPackage
          ? PATH_USER.onlineStore.productSubscription.packages
              .view(productUrl)
              .slice(1)
          : isSubscription
          ? PATH_USER.onlineStore.productSubscription.subscriptions
              .view(productUrl)
              .slice(1)
          : PATH_USER.onlineStore.productSubscription.products
              .view(productUrl)
              .slice(1),
      );
      navigator.clipboard.writeText(URI);
      enqueueSnackbar("Successfully copied");
    } catch (err) {
      enqueueSnackbar("Something went wrong!Try again", { variant: "error" });
    }
  };

  return (
    <CardHeader
      sx={{ p: 0, mt: { md: 0, xs: 2 } }}
      action={
        <>
          {/* <FormControlLabel
            control={<Toggle onChange={onChange} checked={active} />}
          /> */}
        </>
      }
      title={name}
      subheader={
        <>
          <Ternary
            when={productUrl}
            then={
              <>
                <Typography variant="caption">{productUrl}</Typography>
                <IconButton size="small" onClick={copy}>
                  <Iconify icon={icons.copy} />
                </IconButton>
              </>
            }
          />
        </>
      }
    />
  );
};

export default HeaderSection;
