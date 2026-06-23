import moment from "moment";

import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";

import { alpha, styled } from "@mui/material/styles";
import Iconify from "src/components/Iconify";
import ParseDate from "src/components/date";
import Ternary from "src/components/ternary";
import Translate from "src/components/translate";

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

const DocumentCard = ({ handleOpen, color = "primary", doc }) => {
  const { doc_name, created_at, doc_url, id, sample_doc_url, sample_doc_name } =
    doc;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <RootStyle
        sx={{
          color: (theme) => theme.palette[color].darker,
          bgcolor: (theme) => theme.palette[color].lighter,
        }}
      >
        <IconWrapperStyle
          sx={{
            color: (theme) => theme.palette[color].dark,
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(
                theme.palette[color].dark,
                0
              )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
          }}
        >
          <Iconify icon="ion:documents-outline" width={50} height={50} />
        </IconWrapperStyle>
        <Typography variant="h4">
          <Ternary
            when={doc_name}
            then={doc_name}
            otherwise={sample_doc_name}
          />
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          <Translate>products.document.createdAt</Translate> :{" "}
          <ParseDate date={created_at} />
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 1,
            m: 1,
            borderRadius: 1,
          }}
        >
          <Box>
            <Button
              LinkComponent="a"
              target="_blank"
              href={doc_url ?? sample_doc_url}
              type="submit"
              startIcon={<Iconify icon={"carbon:view"} />}
              color="info"
              name="view"
            >
              <Translate>{"products.document.view"}</Translate>
            </Button>
            <Button
              type="submit"
              onClick={() => handleOpen(true)(id)}
              startIcon={<Iconify icon={"akar-icons:edit"} />}
              name="edit"
            >
              <Translate> {"products.document.edit"}</Translate>
            </Button>
            <Button
              onClick={() => handleOpen(false)(id)}
              type="submit"
              startIcon={<Iconify icon={"eva:trash-2-outline"} />}
              color="error"
              name="delete"
            >
              <Translate> {"products.document.delete"}</Translate>
            </Button>
          </Box>
        </Stack>
      </RootStyle>
    </Grid>
  );
};

export default DocumentCard;
