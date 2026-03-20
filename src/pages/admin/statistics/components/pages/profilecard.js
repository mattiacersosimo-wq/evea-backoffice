import React from "react";
// @mui
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
// components
import Iconify from "src/components/Iconify";

import ProfileWidget from "../widgets/profile";

const Profilecard = () => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"carbon:user-avatar-filled-alt"}
                      width={24}
                      height={24}
                      sx={{ color: "#b39ddb" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">Shibi</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.userName"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"fluent-mdl2:status-circle-ring"}
                      width={24}
                      height={24}
                      sx={{ color: "#80cbc4" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">
                    {"adminStatistics.active"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.status"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"carbon:phone-application"}
                      width={24}
                      height={24}
                      sx={{ color: "#90caf9" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">+91 8943 806 124</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.phone"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"dashicons:email-alt"}
                      width={24}
                      height={24}
                      sx={{ color: "#ffe082" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">
                    shibintr@bpract.com
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.email"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>

        {/* center  */}

        <Grid item xs={12} md={4}>
          <ProfileWidget />
        </Grid>

        {/* center  */}

        <Grid item xs={12} md={4}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"dashicons:money-alt"}
                      width={24}
                      height={24}
                      sx={{ color: "#ef9a9a" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">$ 4544</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.totalBalance"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"ic:round-account-balance-wallet"}
                      width={24}
                      height={24}
                      sx={{ color: "#b0bec5" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">$ 544</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.balanceWallet"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"fluent-mdl2:product-variant"}
                      width={24}
                      height={24}
                      sx={{ color: "#bcaaa4" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">21587</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.totalProducts"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined" sx={{ py: 1.5, textAlign: "center" }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Iconify
                      icon={"ri:refund-fill"}
                      width={24}
                      height={24}
                      sx={{ color: "#e6ee9c" }}
                    />
                  </Box>
                  <Typography variant="subtitle2">03</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {"adminStatistics.referrals"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profilecard;
