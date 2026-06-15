import { Alert } from "@mui/material";

// Il messaggio arriva da uno state persistente in use-login (non da RHF), cosi'
// il banner resta visibile finche' non si ritenta il login, invece di sparire
// al primo carattere digitato (il resolver Yup ripuliva l'errore manuale).
const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return <Alert severity="error">{message}</Alert>;
};

export default ErrorBanner;
