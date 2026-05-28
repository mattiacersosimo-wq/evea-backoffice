/**
 * Centralizza la visualizzazione del nome utente in base al contesto.
 *
 * Policy EVEA:
 *  - "global"     → classifiche globali, feed community pubblici: SOLO nickname (username)
 *  - "relational" → propria downline, propri clienti, viste 1:1 tra promoter collegati: nome completo
 *  - "admin"      → backoffice admin per gestione/compliance: nome completo
 *  - "self"       → propria pagina profilo: nome completo
 *
 * In assenza di nome valorizzato, ricade sempre sullo username come fallback.
 */
const buildFullName = (user) => {
  if (!user) return "";
  const fn = (user.first_name || user.firstName || "").trim();
  const ln = (user.last_name || user.lastName || "").trim();
  const composed = `${fn} ${ln}`.trim();
  if (composed) return composed;
  if (user.name && typeof user.name === "string") return user.name.trim();
  return "";
};

export const displayName = (user, context = "global") => {
  if (!user) return "";
  const username = user.username || "";
  if (context === "global") return username || buildFullName(user);
  // relational / admin / self → nome completo se disponibile
  const full = buildFullName(user);
  return full || username;
};

export default displayName;
