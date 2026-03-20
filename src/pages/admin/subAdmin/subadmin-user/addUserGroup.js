import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { PATH_DASHBOARD } from "src/routes/paths";

import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { FormProvider } from "src/components/hook-form";
import Page from "src/components/Page";
import UserGroup from "./userGroup";

const AddUserGroup = () => {
  const [state, setState] = useState({
    productCat: false,
    products: false,
    materialCategories: "",
    materials: "",
    coupon: "",
    userReviews: "",
    assignSubCat: "",
    assignSub: "",
    businessBuilderSub: "",
    blogCat: "",
    blogs: "",
    faqs: "",
    emails: "",
    articleCat: "",
    article: "",
    documents: "",
    videos: "",
    subadmins: "",
    subadminGroups: "",
    brandSettings: "",
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <Page title="Add Users Group : Sub admins">
        <Box>
          <HeaderBreadcrumbs
            heading="Add Users group"
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              {
                name: "Sub Admin Users",
                href: PATH_DASHBOARD.subAdmin.sub_admins,
              },
              { name: "Add Users group" },
            ]}
          />
          <Card sx={{ }}>
            <Typography
              variant="overline"
              sx={{ mb: 3, display: "block", color: "text.secondary" }}
            >
              Select Sidebar Menu
            </Typography>
            <FormProvider>
              <FormGroup>
                <FormLabel component="store">Store</FormLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.productCat}
                      onChange={handleChange}
                      name="productCat"
                    />
                  }
                  label="Product Categories"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.products}
                      onChange={handleChange}
                      name="products"
                      color="primary"
                    />
                  }
                  label="Products"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.materialCategories}
                      onChange={handleChange}
                      name="materialCategories"
                      color="primary"
                    />
                  }
                  label="Material categories"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.materials}
                      onChange={handleChange}
                      name="materials"
                      color="primary"
                    />
                  }
                  label="Materials"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.coupon}
                      onChange={handleChange}
                      name="coupon"
                      color="primary"
                    />
                  }
                  label="Coupon"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.userReviews}
                      onChange={handleChange}
                      name="userReviews"
                      color="primary"
                    />
                  }
                  label="User Reviews"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.assignSubCat}
                      onChange={handleChange}
                      name="assignSubCat"
                      color="primary"
                    />
                  }
                  label="Assign Subscriptions Categories"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.assignSub}
                      onChange={handleChange}
                      name="assignSub"
                      color="primary"
                    />
                  }
                  label="Assign Subscriptions"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.businessBuilderSub}
                      onChange={handleChange}
                      name="businessBuilderSub"
                      color="primary"
                    />
                  }
                  label="Business Builder Subscriptions"
                />
              </FormGroup>

              <Box sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                  <LoadingButton type="submit" variant="contained">
                    Submit
                  </LoadingButton>
                </Stack>
              </Box>
            </FormProvider>
          </Card>
          <Card sx={{  mt: 1 }}>
            <UserGroup />
          </Card>
        </Box>
      </Page>
    </>
  );
};

export default AddUserGroup;
