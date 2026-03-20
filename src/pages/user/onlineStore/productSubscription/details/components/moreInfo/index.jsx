import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, Divider, Stack, Tab, Typography } from "@mui/material";
import { useState } from "react";
import ReactQuill from "react-quill";

import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import Ternary from "src/components/ternary";

import { useTranslation } from "react-i18next";
import Review from "./review";

const MoreInfo = ({ product }) => {
  const [value, setValue] = useState("1");
  const {
    user_reviews,
    product_questions: questions,
    product_description: description,
  } = product;
  const [review] = user_reviews || [];
  const modules = {
    toolbar: null,
  };
  const isEmptyQuestions = !Boolean(questions?.length);
  const isEmptyDescription = !Boolean(description?.length);

  const { t } = useTranslation();

  return (
    <Card>
      <TabContext value={value}>
        <Box sx={{ px: 3, bgcolor: "background.neutral" }}>
          <TabList onChange={(_, value) => setValue(value)}>
            <Tab
              disableRipple
              value="1"
              label={t("global.description")}
              name="description"
            />
            <Tab
              disableRipple
              value="2"
              label={t("global.question_one")}
              name="questions"
            />
            <Tab
              disableRipple
              value="3"
              label={t("user.online_store.product_details.review_other", {
                count: review?.review_count || 0,
              })}
              sx={{ "& .MuiTab-wrapper": { whiteSpace: "nowrap" } }}
              name="review"
            />
          </TabList>
        </Box>

        <Divider />

        <TabPanel value="1">
          <Box sx={{ p: 3 }}>
            {isEmptyDescription ? (
              <EmptyTable title="No Data Available" />
            ) : (
              <Ternary
                when={description}
                then={
                  <ReactQuill
                    value={description}
                    theme="bubble"
                    modules={modules}
                    readOnly
                  />
                }
              />
            )}
          </Box>
        </TabPanel>

        <TabPanel value="2">
          <Stack spacing={3} sx={{ p: 3 }}>
            {isEmptyQuestions ? (
              <EmptyTable title="No Data Available" />
            ) : (
              <Map
                list={questions}
                render={({ title, description, created_at, id }) => (
                  <>
                    <Stack key={id} spacing={1}>
                      <Typography variant="h6">{title}</Typography>
                      <Typography paragraph>{description}</Typography>
                    </Stack>
                    <Divider />
                  </>
                )}
              />
            )}
          </Stack>
        </TabPanel>
        <TabPanel value="3">
          <Review product={product} />
        </TabPanel>
      </TabContext>
    </Card>
  );
};

export default MoreInfo;
