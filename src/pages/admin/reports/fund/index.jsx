import { Box, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import Iconify from "src/components/Iconify";
import useCustomTabs from "src/hooks/useCustomTabs";
import FundCredit from "./components/credit";
import FundDebit from "./components/debit";
import { useTranslation } from "react-i18next";

const Fund = ({ title, heading }) => {
  const { currentTab, onChangeTab } = useCustomTabs(
    "fund_credit",
    "fund_credit"
  );
  const SUB_TABS = [
    {
      label: "global.fund_credit",
      dataKey: "fund_credit",
      value: "fund_credit",
      icon: (
        <Iconify
          icon={"mdi:account-credit-card-outline"}
          width={20}
          height={20}
        />
      ),
      component: <FundCredit title={title} heading={heading} />,
    },
    {
      label: "global.fund_debit",
      dataKey: "fund_debit",
      value: "fund_debit",
      icon: (
        <Iconify
          icon={
            "streamline:money-atm-card-1-credit-pay-payment-debit-card-finance-plastic-money"
          }
          width={20}
          height={20}
        />
      ),
      component: <FundDebit title={title} heading={heading} />,
    },
  ];
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          sx={{ p: 1 }}
        >
          {SUB_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={t(tab.label)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box />

        {SUB_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box  key={tab.value}>{tab.component}</Box>;
        })}
      </Box>
    </>
  );
};

export default Fund;
