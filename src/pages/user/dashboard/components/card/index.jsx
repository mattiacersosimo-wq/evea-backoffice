import { Box, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import LabeledPaper from "src/components/LabeledPaper";
import { PATH_USER } from "src/routes/paths";
import Content from "./content";
import Image from "./image";
import list from "./_mock/list";

const Card = () => {
  return (
    <>
      {list.map(({ body, isActive, id, img, subTitle, title }) => (
        <Paper
          variant="outlined"
          sx={{
            padding: "1rem",
            margin: "0.8rem 0",
          }}
        >
          <Box
            key={id}
            sx={{
              display: "flex",
            }}
          >
            <Image src={img} />
            <Content
              body={body}
              isActive={isActive}
              subTitle={subTitle}
              title={title}
            />
          </Box>
        </Paper>
      ))}
    </>
  );
};

export default () => {
  return (
    <LabeledPaper label="My Active Subscriptions">
      <Card />
      <Box sx={{ textAlign: "center" }}>
        <Button
          LinkComponent={Link}
          to={PATH_USER.subscriptions.root}
          startIcon={<Iconify icon="carbon:view" />}
        >
          View All Active subscriptions
        </Button>
      </Box>
    </LabeledPaper>
  );
};
