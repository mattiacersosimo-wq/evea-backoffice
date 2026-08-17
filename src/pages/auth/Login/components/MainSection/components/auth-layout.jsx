import { Box, Container, Paper } from "@mui/material";
import useGetLogo from "src/components/logo/hooks/use-logo";

const AuthLayout = ({ children }) => {
  const logo = useGetLogo();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        maxHeight: "100dvh",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        pt: { xs: "calc(24px + env(safe-area-inset-top))", md: "80px" },
        pb: { xs: "calc(24px + env(safe-area-inset-bottom))", md: "80px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
