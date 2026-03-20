import { Box, Card, Grid } from "@mui/material";
import Actions from "./Actions";
import CardBody from "./CardBody";
import HeaderSection from "./HeaderSection";
import useChangeStatus from "./hooks/useChangeStatus";

const ProductCard = (props) => {
  const {
    id,
    refresh,
    active,
    product_images,
    name,
    product_url,
    category,
    product_prices,
    is_package,
    status,
    product_image,
  } = props;
  const { changeStatus, isActive } = useChangeStatus(active);

  return (
    <Card
      sx={{
        my: 2,
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Box
          sx={{
            width: { md: "200px", xs: "100%" },
            mr: { md: "20px", xs: "0" },
          }}
        >
          <img
            src={product_image}
            style={{ borderRadius: "0.8rem", width: "100%" }}
          />
        </Box>

        <Box
          sx={{
            width: { md: "calc(100% - 220px)", xs: "100%" },
            overflowWrap: "anywhere",
            position: "relative",
          }}
        >
          <HeaderSection
            active={isActive}
            imageUrl={product_image}
            onChange={() => changeStatus(id)}
            name={name}
            productUrl={product_url}
          />
          <CardBody
            category_name={category?.name}
            product_prices={product_prices}
            is_package={is_package}
          />
          <Actions
            data={props}
            refresh={refresh}
            status={{
              ...status,
              document: false,
              video: false,
              questions: false,
              sampleDocument: false,
              edit: false,
              delete: false,
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default ProductCard;
