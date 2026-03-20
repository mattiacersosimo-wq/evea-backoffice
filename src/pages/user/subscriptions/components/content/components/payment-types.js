import { Menu, MenuItem } from "@mui/material";
import Map from "src/components/map";
import useGetPaymentTypes from "../hooks/use-get-payment-types";

const PaymentTypes = ({ anchorEl, onClose, enableRecurring }) => {
  const open = Boolean(anchorEl);
  const paymentTypes = useGetPaymentTypes(open);

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <Map
        list={paymentTypes}
        render={({ id, name, image }) => (
          <MenuItem onClick={enableRecurring(id)}>
            <img src={image} width="50px" style={{ marginRight: "1rem" }} />{" "}
            {name}
          </MenuItem>
        )}
      />
    </Menu>
  );
};

export default PaymentTypes;
