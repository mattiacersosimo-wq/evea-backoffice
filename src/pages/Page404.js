import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { m } from "framer-motion";
import { PageNotFoundIllustration } from "src/assets";
import { MotionContainer, varBounce } from "src/components/animate";
import Page from "src/components/Page";
import Ternary from "src/components/ternary";
import useAuth from "src/hooks/useAuth";

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

export default function Page404() {
  const isSubAdmin = JSON.parse(localStorage.getItem("isSubAdmin"));
  const { logout } = useAuth();

  return (
    <Page title="404 — Pagina non trovata" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                <Ternary
                  when={isSubAdmin}
                  then="Permessi non sufficienti"
                  otherwise="Pagina non trovata"
                />
              </Typography>
            </m.div>
            <Typography sx={{ color: "text.secondary" }}>
              <Ternary
                when={isSubAdmin}
                then="Non hai i permessi necessari per accedere a questa pagina. Contatta un amministratore."
                otherwise="La pagina che stai cercando non esiste. Controlla che l'indirizzo sia corretto."
              />
            </Typography>

            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration
                sx={{ height: 260, my: { xs: 5, sm: 10 } }}
              />
            </m.div>
            <Ternary
              when={isSubAdmin}
              then={
                <Button onClick={logout} size="large" variant="contained">
                  Logout
                </Button>
              }
            />
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
