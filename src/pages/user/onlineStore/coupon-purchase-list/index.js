import {
  Card,
  Stack,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  alpha,
} from "@mui/material";
import React from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import DataHandlerTable from "src/components/data-handler/table";
import ParseDate from "src/components/date";
import Map from "src/components/map";
import PaginationButtons from "src/components/pagination";
import { Currency } from "src/components/with-prefix";
import { PATH_DASHBOARD } from "src/routes/paths";
import useCouponPurchase from "./hooks/useCouponPurchase";

const CouponList = () => {
  const { state, fetchData, rowStart, ...rest } = useCouponPurchase();
  const { data, ...dataProps } = state;

  const getStatusChip = (coupon) => {
    const now = new Date();
    const start = new Date(coupon.start_date);
    const end = new Date(coupon.end_date);

    if (coupon.active !== 1) {
      return <Chip label="Inactive" color="default" size="small" />;
    }
    if (now < start) {
      return <Chip label="Not Started" color="warning" size="small" />;
    }
    if (now > end) {
      return <Chip label="Expired" color="error" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      rob_bonus: "ROB Bonus",
      percentage: "Percentage Discount",
      fixed: "Fixed Amount",
    };
    return (
      labels[type] ||
      type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")
    );
  };

  return (
    <Page title="coupons.user.list.title">
      <HeaderBreadcrumbs
        heading="coupons.user.list.title"
        links={[
          { name: "global.dashboard", href: PATH_DASHBOARD.root },
          { name: "coupons.user.list.title" },
        ]}
      />

      <Card sx={{ pt: 1 }}>
        <Scrollbar>
          <DataHandlerTable
            name="coupon-purchase-table"
            headers={[]}
            dataProps={{ ...dataProps }}
          >
            <Grid container spacing={3} sx={{ p: 3 }}>
              <Map
                list={data}
                render={(coupon) => {
                  const isActive = coupon.active === 1;
                  const isExpired = new Date() > new Date(coupon.end_date);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} height="100%" key={coupon.id}>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "visible",
                          borderRadius: 3,
                          boxShadow: isActive ? 8 : 3,
                          background: isActive
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#e0e0e0",
                          color: isActive ? "#fff" : "#666",
                          transition: "all 0.4s ease",
                          transform: isActive
                            ? "translateY(0)"
                            : "translateY(4px)",
                          opacity: isActive ? 1 : 0.65,
                          filter: isActive ? "none" : "grayscale(100%)",
                          "&:hover": {
                            transform: isActive
                              ? "translateY(-8px)"
                              : "translateY(0)",
                            boxShadow: isActive ? 12 : 3,
                          },
                          "&:before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "10px",
                            background: isActive
                              ? "repeating-linear-gradient(90deg, #fff, #fff 12px, transparent 12px, transparent 24px)"
                              : "repeating-linear-gradient(90deg, #ccc, #ccc 12px, transparent 12px, transparent 24px)",
                          },
                          "&:after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "10px",
                            background: isActive
                              ? "repeating-linear-gradient(90deg, #fff, #fff 12px, transparent 12px, transparent 24px)"
                              : "repeating-linear-gradient(90deg, #ccc, #ccc 12px, transparent 12px, transparent 24px)",
                          },
                        }}
                      >
                        <Box sx={{ p: 3, position: "relative", zIndex: 1 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                          >
                            <Typography
                              variant="h6"
                              noWrap
                              sx={{
                                maxWidth: "68%",
                                opacity: isActive ? 1 : 0.8,
                                fontWeight: isActive ? 600 : 500,
                              }}
                            >
                              {coupon.name}
                            </Typography>
                            {getStatusChip(coupon)}
                          </Stack>

                          <Divider
                            sx={{
                              borderColor: alpha(
                                isActive ? "#fff" : "#999",
                                isActive ? 0.3 : 0.2
                              ),
                              mb: 2,
                            }}
                          />

                          <Typography
                            variant="h4"
                            align="center"
                            sx={{
                              fontWeight: 800,
                              letterSpacing: 3,
                              mb: 2,
                              opacity: isActive ? 1 : 0.7,
                              color: isActive ? "inherit" : "#444",
                            }}
                          >
                            Coupon Code : {coupon.code}
                          </Typography>

                          <Grid
                            container
                            spacing={1}
                            sx={{ fontSize: "0.9rem" }}
                          >
                            {[
                              {
                                label: "Start",
                                value: <ParseDate date={coupon.start_date} />,
                              },
                              {
                                label: "End",
                                value: <ParseDate date={coupon.end_date} />,
                              },
                              {
                                label: "Discount",
                                value: <Currency>{coupon.discount}</Currency>,
                              },
                              {
                                label: "Type",
                                value: getTypeLabel(coupon.type),
                              },
                            ].map((item, idx) => (
                              <Grid item xs={6} key={idx}>
                                <Typography
                                  variant="body2"
                                  sx={{ opacity: isActive ? 0.9 : 0.7 }}
                                >
                                  {item.label}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontWeight="bold"
                                  sx={{ color: isActive ? "inherit" : "#555" }}
                                >
                                  {item.value}
                                </Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Card>
                    </Grid>
                  );
                }}
              />
            </Grid>
          </DataHandlerTable>
        </Scrollbar>

        <PaginationButtons {...rest} />
      </Card>
    </Page>
  );
};

export default CouponList;
