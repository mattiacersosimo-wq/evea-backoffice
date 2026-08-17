import { Box, Container, Paper } from "@mui/material";
import { useEffect } from "react";
import useGetLogo from "src/components/logo/hooks/use-logo";

const AuthLayout = ({ children }) => {
  const logo = useGetLogo();

  // iOS Safari WebView "rubber band scroll" ignora overflow:hidden sul Box
  // fisso interno. Serve bloccare a livello body/html quando siamo in login,
  // poi ripristinare a unmount cosi' il resto dell'app scrolla normalmente.
  useEffect(() => {
    const originalBodyStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      width: document.body.style.width,
      height: document.body.style.height,
      overscrollBehavior: document.body.style.overscrollBehavior,
      touchAction: document.body.style.touchAction,
    };
    const originalHtmlStyle = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };
    // Blocca rubber band iOS
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "manipulation";
    return () => {
      // Ripristina esattamente com'era (non forza "" se aveva altri valori)
      Object.assign(document.body.style, originalBodyStyle);
      Object.assign(document.documentElement.style, originalHtmlStyle);
    };
  }, []);

  return (
    <Box
      sx={{
        // position fixed: il Box occupa tutto il viewport senza contribuire
        // allo scroll del body — blocca scroll su/giu del login su iOS
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        pt: { xs: "calc(24px + env(safe-area-inset-top))", md: "80px" },
        pb: { xs: "calc(24px + env(safe-area-inset-bottom))", md: "80px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            padding: { xs: 2.5, md: 3 },
            border: { xs: "none", md: "1px solid" },
            borderColor: { md: "divider" },
            boxShadow: { xs: "none", md: "0 4px 20px rgba(0,0,0,0.04)" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 3,
              justifyContent: "center",
            }}
          >
            <img
              style={{ width: "180px", height: "auto", maxWidth: "60%" }}
              src={logo}
              alt="eVea Backoffice"
            />
          </Box>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
