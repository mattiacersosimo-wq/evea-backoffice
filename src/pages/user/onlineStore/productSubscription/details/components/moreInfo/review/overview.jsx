import {
  Button,
  Grid,
  LinearProgress,
  Rating,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import sumBy from "lodash/sumBy";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Translate from "src/components/translate";
import { fShortenNumber } from "src/utils/formatNumber";

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  "&:nth-of-type(2)": {
    [theme.breakpoints.up("md")]: {
      borderLeft: `solid 1px ${theme.palette.divider}`,
      borderRight: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

const Overview = ({ product, onOpen, notReviewed }) => {
  const { ratings, user_reviews, review: isReview } = product;
  const isReviews = isReview == "1";
  const total = sumBy(ratings, (star) => star.starCount);

  const [review] = user_reviews || [];
  const { t } = useTranslation();
  const rating = parseFloat(review?.rating)?.toFixed(1);
  return (
    <Grid container>
      <GridStyle item xs={12} md={4}>
        <Typography variant="subtitle1" gutterBottom>
          <Translate>
            user.online_store.product_details.average_rating
          </Translate>
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: "error.main" }}>
          {Number(rating) ? rating : 0}/5
        </Typography>
        <RatingStyle readOnly value={rating} precision={0.1} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("user.online_store.product_details.review_other", {
            count: review?.review_count || 0,
          })}
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          {ratings
            ?.slice(0)
            .reverse()
            .map((rating) => (
              <ProgressItem key={rating.name} star={rating} total={total} />
            ))}
        </Stack>
      </GridStyle>

      {notReviewed && isReviews ? (
        <GridStyle item xs={12} md={4}>
          <Button
            size="large"
            onClick={onOpen}
            variant="outlined"
            startIcon={<Iconify icon={"eva:edit-2-fill"} />}
            name="review"
          >
            <Translate>user.online_store.write_review</Translate>
          </Button>
        </GridStyle>
      ) : null}
    </Grid>
  );
};

Overview.propTypes = {
  product: PropTypes.object,
  onOpen: PropTypes.func,
};

const ProgressItem = ({ star, total }) => {
  const { name, starCount, reviewCount } = star;
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">{name}</Typography>
      <LinearProgress
        variant="determinate"
        value={(starCount / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: "divider",
        }}
      />
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", minWidth: 64, textAlign: "right" }}
      >
        {fShortenNumber(reviewCount)}
      </Typography>
    </Stack>
  );
};

ProgressItem.propTypes = {
  star: PropTypes.object,
  total: PropTypes.number,
};

export default Overview;
