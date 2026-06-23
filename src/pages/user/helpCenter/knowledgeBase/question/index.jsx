import { Box, Card, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import moment from "moment";
import { useState } from "react";
import ReactQuill from "react-quill";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ParseDate from "src/components/date";

import { PATH_USER } from "src/routes/paths";
import useArticleGetById from "../hook/useArticleGetById";
import Related from "./related";

const getRandomDate = () => {
  const maxDate = Date.now();
  const timestamp = Math.floor(Math.random() * maxDate);
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
};

const Questions = () => {
  const [articleId, setArticleId] = useState(null);
  const { id } = useParams();
  const { articleDetails, fetchArticleDetails } = useArticleGetById(id);
  const location = useLocation();
  const { articles, name } = location.state;
  const handleArticle = (id) => (e) => {
    setArticleId(id);
    fetchArticleDetails(id);
  };
  return (
    <Page
      sx={{ p: { xl: "0px", lg: "0px", xs: "10px" } }}
      title={"userHelpCenter.knowledgeBase.faqTitle"}
    >
      <Box>
        <HeaderBreadcrumbs
          sx={{ mb: 1, pl: 1 }}
          heading={"userHelpCenter.knowledgeBase.knowledgeBase"}
          links={[
            { name: "dashboard", href: PATH_USER.root },
            { name: "userHelpCenter.knowledgeBase.knowledgeBase" },
          ]}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              lg: "25% 75%",
              md: "35% 65%",
              sm: "100% 100%",
            },
            gridRow: 1,
            columnGap: 2,
            rowGap: 2,
          }}
        >
          <Related
            articles={articles}
            name={name}
            handleArticle={handleArticle}
          />
          <Card
            sx={{
              padding: "1rem",
            }}
          >
            <Typography variant="h6">{articleDetails.title}</Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {"userHelpCenter.knowledgeBase.lastUpdated"}{" "}
              <ParseDate date={articleDetails.updated_at} />
            </Typography>

            <ReactQuill
              value={articleDetails.description}
              readOnly
              theme="bubble"
              modules={{
                toolbar: false,
              }}
            />
          </Card>
        </Box>
      </Box>
    </Page>
  );
};

export default Questions;
