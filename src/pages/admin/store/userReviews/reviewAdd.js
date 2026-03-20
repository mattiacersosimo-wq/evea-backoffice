import { Box, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";

import Form from "./Form";
import useAddReview from "./hooks/useAddReview";
import Translate from "src/components/translate";

const RootStyle = styled("div")(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

const ReviewAdd = () => {
  const addReview = useAddReview();

  return (
    <div>
      <Page title={"user_review.reviewAddTitile"}>
        <Box>
          <HeaderBreadcrumbs
            heading={"user_review.review_add_title"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              { name: "user_review.review_add_title" },
            ]}
          />
          <Card sx={{ p: 1 }}>
            <RootStyle  sx={{backgroundColor:"transparent",p:0}}>
              <Typography variant="subtitle1" gutterBottom >
                <Translate>user_review.leave_a_comment</Translate>
              </Typography>
              <Form {...addReview} />
            </RootStyle>
          </Card>
        </Box>
      </Page>
    </div>
  );
};

export default ReviewAdd;
