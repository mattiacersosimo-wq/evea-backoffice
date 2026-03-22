import InvoiceDetails from "../invoiceDetails";
import InvoiceBody from "./body";
import useFetchInvoiceDetails from "./hooks/useFetchInvoiceDetails";
import InvoiceTitle from "./title";

import { Box, Button, Card, Chip, CircularProgress, Container, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Iconify from "src/components/Iconify";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import axiosInstance from "src/utils/axios";

import { PATH_USER } from "src/routes/paths";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const TrackingSection = ({ orderId }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await axiosInstance.get(`api/wp/order/${orderId}/tracking`);
        setTracking(data?.data);
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, [orderId]);

  const copyTracking = async () => {
    if (tracking?.tracking_number) {
      await navigator.clipboard.writeText(tracking.tracking_number);
      enqueueSnackbar("Tracking copiato!", { variant: "success" });
    }
  };

  if (loading) return <Card sx={{ p: 2, mb: 2, textAlign: "center" }}><CircularProgress size={24} sx={{ color: ORO }} /></Card>;
  if (!tracking || !tracking.tracking_number) {
    return (
      <Card sx={{ p: 2, mb: 2, border: "1px solid #E8DDCA", borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify icon="mdi:truck-outline" width={22} sx={{ color: "#aaa" }} />
          <Typography sx={{ fontSize: "0.85rem", color: "#7A6A5C" }}>Spedizione non ancora disponibile</Typography>
        </Stack>
      </Card>
    );
  }

  const statusMap = {
    success: { label: "Consegnato", bgcolor: "#EAF3DE", color: "#27500A" },
    delivered: { label: "Consegnato", bgcolor: "#EAF3DE", color: "#27500A" },
    in_transit: { label: "In transito", bgcolor: "#FAF3E0", color: "#854F0B" },
    pending: { label: "In preparazione", bgcolor: "#E8DDCA", color: "#5C4A3A" },
  };
  const st = statusMap[tracking.fulfillment_status] || statusMap.pending;

  return (
    <Card sx={{ p: 2.5, mb: 2, border: "1px solid #E8DDCA", borderRadius: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(ORO, 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Iconify icon="mdi:truck-fast-outline" width={22} sx={{ color: ORO }} />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: ESPRESSO }}>Tracking</Typography>
              <Chip label={st.label} size="small" sx={{ bgcolor: st.bgcolor, color: st.color, fontWeight: 600, fontSize: "0.65rem", height: 22 }} />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={{ fontSize: "0.82rem", color: "#7A6A5C" }}>
                {tracking.carrier && <b>{tracking.carrier} — </b>}{tracking.tracking_number}
              </Typography>
              <IconButton size="small" onClick={copyTracking} sx={{ color: ORO }}>
                <Iconify icon="mdi:content-copy" width={16} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
        {tracking.tracking_url && (
          <Button size="small" variant="contained" href={tracking.tracking_url} target="_blank"
            startIcon={<Iconify icon="mdi:open-in-new" />}
            sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            Traccia spedizione
          </Button>
        )}
      </Stack>
    </Card>
  );
};

const MyOrders = () => {
  const invoice = useFetchInvoiceDetails();
  const { id } = useParams();

  return (
    <>
      <Page title={"user.online_store.my_orders.details.title"}>
        <Container sx={{ width: "100%" }}>
          <HeaderBreadcrumbs
            heading={"user.online_store.my_orders.details.title"}
            links={[
              { name: "global.dashboard", href: PATH_USER.root },
              {
                name: "user.online_store.my_orders.title",
                href: PATH_USER.my_orders.root,
              },
              { name: invoice?.invoice_id || "" },
            ]}
          />
          <TrackingSection orderId={id} />
          <InvoiceDetails
            invoice={invoice}
            BodyComponent={InvoiceBody}
            TitleComponent={InvoiceTitle}
          />
        </Container>
      </Page>
    </>
  );
};

export default MyOrders;
