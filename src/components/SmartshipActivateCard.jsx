import { Button } from "@mui/material";
import Iconify from "src/components/Iconify";
import { WP_URL } from "src/config";

const ORO = "#B8963B";

// Componente wrapper del bottone "Attiva smartship". Ora e' un semplice
// redirect alla pagina Shopify /collections/all. Fase 2 (attivazione via
// API Seal delayed +30gg) messa in pausa: Seal richiede payment_method_id
// interno che possiamo ottenere solo se il cliente ha gia' completato un
// checkout subscription su Shopify - non fattibile per clienti spot.
const SmartshipActivateCard = ({ renderTrigger }) => {
  const targetUrl = `${WP_URL.replace(/\/$/, "")}/collections/all`;

  const handleClick = () => window.open(targetUrl, "_blank");

  if (renderTrigger) {
    return renderTrigger({ onClick: handleClick, useDialog: false });
  }

  return (
    <Button
      variant="contained"
      size="large"
      onClick={handleClick}
      startIcon={<Iconify icon="mdi:storefront-outline" />}
      sx={{ bgcolor: ORO, "&:hover": { bgcolor: "#A07E2F" }, fontWeight: 700, textTransform: "none", borderRadius: 2, px: 3 }}
    >
      Attiva smartship
    </Button>
  );
};

export default SmartshipActivateCard;
