import { Box, Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pie, PieChart } from "recharts";
import Translate from "src/components/translate";
import { Currency } from "src/components/with-prefix";
import { twoPlaceRound } from "src/utils/round";
import useIncomePayout from "./hooks/use-income-payout";

const IncomePayoutGraph = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const state = useIncomePayout();

  const { income, payout, income_percentage, payout_percentage } = state;

  const test = useMemo(() => {
    return [
      {
        data: [
          {
            name: "Expense",
            value: parseFloat(payout || 0),
            fill: theme.palette.primary.dark,
          },
          {
            name: "Income",
            value: parseFloat(income || 0),
            fill: theme.palette.primary.main,
          },
        ],
      },
    ];
  }, [income, payout]);

  return (
    <Card
      sx={{
        p: 1.5,
        display: { lg: "block", md: "flex" },
        alignItems: { lg: "flex-start", md: "center" },
        height: { lg: "203px", md: "310px" },
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", position: "relative", width: "100%" }}>
        <Box
          sx={{
            mt: { md: "35px", xs: "20px" },
            width: {
              xl: "140px",
              lg: "100px",
              md: "40%",
              sm: "40%",
              xs: "40%",
            },
          }}
        >
          <PieChart width={100} height={100}>
            {test.map((s) => {
              return (
                <Pie
                  dataKey="value"
                  isAnimationActive={true}
                  data={s.data}
                  cx={45}
                  cy={45}
                  outerRadius={45}
                  innerRadius={33}
                  fill="#fff"
                />
              );
            })}
          </PieChart>
        </Box>
        <Box
          sx={{
            width: {
              xl: "calc(100% - 140px)",
              lg: "calc(100% - 100px)",
              md: "60%",
              sm: "60%",
              xs: "60%",
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mt: 1.7, lineHeight: "1.1", fontWeight: "400" }}
          >
            <Translate>user_dashboard.payout_graph</Translate>
          </Typography>

          <Box sx={{ mt: 2.3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <b
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  backgroundColor: theme.palette.primary.main,
                }}
              ></b>
              <Typography
                variant="subtitle2"
                sx={{ display: "block", fontSize: "14px", mx: 1 }}
              >
                <Currency>{income}</Currency>
              </Typography>
              {/* <span
                style={{
                  color:
                    income_percentage < 0
                      ? theme.palette.widgets.red[500]
                      : theme.palette.widgets.green[500],
                  fontSize: "12px",
                }}
              >
                ({twoPlaceRound(income_percentage || 0)}%)
              </span> */}
            </Box>
            <Box
              sx={{
                color: theme.palette.widgets.tertiary[500],
                pl: "18px",
                fontWeight: "300",
                fontSize: "12px",
              }}
            >
              {t("user_dashboard.incomeInfo")}
            </Box>
          </Box>
          {/* ================= */}
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <b
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  backgroundColor: theme.palette.primary.dark,
                }}
              ></b>
              <Typography
                variant="subtitle2"
                sx={{ display: "block", fontSize: "14px", mx: 1 }}
              >
                <Currency>{payout}</Currency>
              </Typography>
              {/* <span
                style={{
                  color:
                    payout_percentage < 0
                      ? theme.palette.widgets.red[500]
                      : theme.palette.widgets.green[500],
                  fontSize: "12px",
                }}
              >
                ({payout_percentage || 0}%)
              </span> */}
            </Box>
            <Box
              sx={{
                color: theme.palette.widgets.tertiary[500],
                pl: "18px",
                fontWeight: "300",
                fontSize: "12px",
              }}
            >
              {t("user_dashboard.payoutInfo")}
            </Box>
          </Box>
          {/* ================= */}
        </Box>
      </Box>
    </Card>
  );
};

export default IncomePayoutGraph;
