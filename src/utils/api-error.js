/**
 * Estrae il messaggio d'errore leggibile da un rigetto di axiosInstance.
 *
 * Perche' serve: l'interceptor in utils/axios.js NON rigetta con l'oggetto
 * errore axios, ma direttamente con `error.response.data`. Quindi il pattern
 * diffuso `e?.response?.data?.error` e' sempre undefined e fa scattare il
 * fallback generico ("Errore"), nascondendo all'utente la spiegazione che il
 * backend aveva gia' fornito.
 *
 * Caso reale 27/08/2026: un nuovo incaricato vedeva solo "Errore" mentre il
 * server rispondeva "Codice scaduto o non richiesto. Richiedi un nuovo codice."
 *
 * Gestisce entrambe le forme (data diretto e oggetto axios completo) cosi'
 * funziona anche se un domani l'interceptor viene normalizzato.
 */
const apiError = (e, fallback = "Si è verificato un errore. Riprova.") => {
  if (!e) return fallback;

  if (typeof e === "string") return e;

  const data = e?.response?.data ?? e;

  const direct = data?.error || data?.message;
  if (typeof direct === "string" && direct.trim()) return direct;

  // Validazione Laravel/Lumen: { errors: { campo: ["messaggio", ...] } }
  const errors = data?.errors;
  if (errors && typeof errors === "object") {
    const first = Object.values(errors).flat().find((m) => typeof m === "string" && m.trim());
    if (first) return first;
  }

  if (typeof e?.message === "string" && e.message.trim()) return e.message;

  return fallback;
};

export default apiError;
