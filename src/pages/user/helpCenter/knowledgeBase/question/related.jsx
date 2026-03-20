import { Card, Link, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { capitalCase, headerCase } from "change-case";

import Iconify from "src/components/Iconify";

import { PATH_USER } from "src/routes/paths";

import useGetArticle from "../hook/useGetArticle";

const Related = ({ articles, name, handleArticle }) => {
  const questions = [
    "userHelpCenter.knowledgeBase.question1",
    "userHelpCenter.knowledgeBase.question2",
    "userHelpCenter.knowledgeBase.question3",
    "userHelpCenter.knowledgeBase.question4",
    "userHelpCenter.knowledgeBase.question5",
  ];

  const { palette } = useTheme();
  return (
    <Card
      sx={{
        height: "100%",
        padding: "1rem",
        height: "fit-content",
        gridRow: { md: "initial", sm: "2 / 3", xs: "2 / 3" },
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Iconify icon="charm:info" />
          <Typography>{name} </Typography>
        </Stack>
        <Stack spacing={2}>
          {articles?.map(({ title, id }) => (
            <Link
              color="white"
              sx={{
                color: palette.primary.main,
                textDecoration: "none",
                fontSize: "14px",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.light",
                },
              }}
              onClick={handleArticle(id)}
            >
              {title}
            </Link>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Related;
