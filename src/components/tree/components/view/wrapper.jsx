import Box from "@material-ui/core/Box";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import styles from "../../style.module.css";

const theme = createTheme({
  palette: {
    background: "#ECECF4",
  },
  fontFamily: "Roboto, sans-serif",
});

const Wrapper = ({ children }) => (
  <Grid item xs={12} md={10}>
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "background.default",
          borderRadius: 16,
          border: "2px dashed rgba(145, 158, 171, 0.24)",
        }}
        className={styles.tree_area}
        padding={2}
      >
        {children}
      </Box>
    </ThemeProvider>
  </Grid>
);

export default Wrapper;
