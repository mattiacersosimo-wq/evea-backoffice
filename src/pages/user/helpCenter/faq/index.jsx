import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { paramCase } from "change-case";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router";
import { NavLink as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import DataHandlerList from "src/components/data-handler/list";
import Loop from "src/components/loop";



import Translate from "src/components/translate";
import { PATH_USER } from "src/routes/paths";
import NavButton from "./components/NavButton";
import useFaq from "./hooks/useFaq";
import Picture from "./picture";

const Faqs = () => {
  const navigate = useNavigate();
  const { state } = useFaq();
  const { label } = useParams();
  const { palette, breakpoints, shape } = useTheme();
  const [expanded, setExpanded] = useState(-1);
  const handleChange = (index) => (e, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };
  const { data, ...dataProps } = state;

  const { categories, data: faqs } = data;
  useEffect(() => {
    if (label && label !== "view") {
      const linkTo = PATH_USER.helpCenter.faq.view(label);
      navigate(linkTo);
      return;
    }
    const linkTo = PATH_USER.helpCenter.faq.view(
      categories?.find(Boolean)?.slug
    );

    navigate(linkTo);
  }, [categories, label]);
  const matches = useMediaQuery(breakpoints.up("sm"));
  const [active, setActive] = useState({ name: "", icon: "" });
  useEffect(() => {
    const item = categories.find(({ slug }) => slug === label);
    if (item) {
      setActive(item);
    }
  }, [label, categories]);

  const faq = faqs.find((item) => paramCase(item.name) === label)?.faq;
  const isDark = palette.mode === "dark";



  return (
    <Page title="faq.title">
      <Box sx={{ p: 0 }}>
        <HeaderBreadcrumbs
          sx={{ pl: 1 }}
          heading="faq.title"
          links={[
            { name: "global.dashboard", href: PATH_USER.root },
            { name: "faq.title" },
          ]}
        />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Box className="FaqCatgryBox">
            <Card sx={{ p: 2, borderRadius: "4px" }}>
              <Typography sx={{ pt: 1, mb: 2 }} variant="subtitle2">
                <Translate>faq.browse_categories</Translate>
              </Typography>
              <DataHandlerList
                dataProps={dataProps}
                forceEmpty={categories.length === 0}
              >
                <Stack spacing={1}>
                  <Loop
                    list={categories}
                    render={({ name, slug }) => (
                      <NavButton
                        to={slug}
                        label={name}
                        reset={() => setExpanded(-1)}
                      />
                    )}
                  />
                </Stack>
              </DataHandlerList>
            </Card>

            <Card sx={{ py: 2, borderRadius: "4px", mt: 2 }}>
              {matches && (
                <Stack alignItems="center" sx={{ mt: 2, p: 5 }}>
                  <Picture />
                </Stack>
              )}
              <Box alignItems="center" sx={{ textAlign: "center" }}>
                <Typography sx={{ pt: 2 }} variant="h6">
                  <Translate>faq.looking_for</Translate>
                </Typography>
                <Typography
                  variant="p"
                  sx={{ px: 4, py: 2, display: "block", fontSize: "15px" }}
                >
                  <Translate>faq.looking_for_message</Translate>
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mb: 2 }}
                  component={RouterLink}
                  to={PATH_USER.helpCenter.createTicket.subCategory()}
                >
                  <Translate>faq.create</Translate>
                </Button>
              </Box>
            </Card>
          </Box>

          <Card className="FaqqustnAnswerBox" sx={{ borderRadius: "4px" }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                marginBottom: "1rem",
              }}
            >
              <Iconify
                icon={active.icon}
                sx={{
                  fontSize: "1rem",
                  color: palette.primary.main,
                }}
              />
              <Stack>
                <Typography variant="subtitle2">{active.name}</Typography>
              </Stack>
            </Stack>
            <DataHandlerList
              dataProps={{ ...dataProps }}
              forceEmpty={faqs.length === 0 || faq?.length === 0}
            >
              <Stack spacing={1}>
                <Box>
                  {faq?.map(({ id, question, answer }, i) => (
                    <Accordion
                      className="faqAccidn"
                      key={i}
                      onChange={handleChange(i)}
                      expanded={expanded === i}
                      sx={{ border:  isDark ? "1px solid #3c4752" : "1px solid #e8e8e8",
                        "&::before": {
                          content: "none",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<Iconify icon="ic:baseline-expand-more" />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography sx={{ color: isDark ? "#f1f1f1" : "#000" }}>
                          {question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 1 }}>
                        {/* <span dangerouslySetInnerHTML={{ __html: answer }} /> */}
                        <ReactQuill
                          value={answer}
                          theme="bubble"
                          readOnly
                          style={{ color: isDark ? "#bababa" : "#000" }}
                        />
                        {/* <Typography>{answer}</Typography> */}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Stack>
            </DataHandlerList>
          </Card>
        </Box>

        {/* Footer */}

        {/* <Footer /> */}
      </Box>
    </Page>
  );
};

export default Faqs;
