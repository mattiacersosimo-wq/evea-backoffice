import { IconButton, Stack, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import Iconify from "src/components/Iconify";
import useAuth from "src/hooks/useAuth";
import { PATH_USER } from "src/routes/paths";

const InvoiceToolbar = () => {
  const { isAdmin } = useAuth();
  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        sx={{ mb: 5 }}
      >
        {isAdmin ? null : (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Support">
              <IconButton
                LinkComponent={Link}
                to={PATH_USER.helpCenter.root}
                name="support"
              >
                <Iconify icon={"ic:round-support-agent"} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Telegram">
              <IconButton
                LinkComponent={"a"}
                href="https://web.telegram.org/"
                target="_blank"
                name="telegram"
              >
                <Iconify icon={"ic:baseline-telegram"} />
              </IconButton>
            </Tooltip>

            {/* <Tooltip title="My Subscriptions">
            <IconButton
              LinkComponent={Link}
              to={PATH_USER.subscriptions.root}
              name="subscribe"
            >
              <Iconify icon="ic:baseline-unsubscribe" />
            </IconButton>
          </Tooltip> */}
          </Stack>
        )}
      </Stack>

      {/* <Dialog fullScreen open={open}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: "12px !important",
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={onClose}>
                <Iconify icon={"eva:close-fill"} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
            <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
              <InvoicePDF invoice={invoice} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog> */}
    </>
  );
};

export default InvoiceToolbar;
