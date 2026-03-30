const escapeHtml = (str) => {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const ALLOWED_DOMAINS = [
  "paypal.com",
  "www.paypal.com",
  "sandbox.paypal.com",
  "stripe.com",
  "checkout.stripe.com",
  "api.myevea.com",
  "myevea.com",
  "www.myevea.com",
  "account.myevea.com",
];

const safeRedirect = (url, target = "_self") => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
    const domain = parsed.hostname;
    if (ALLOWED_DOMAINS.some((d) => domain === d || domain.endsWith("." + d))) {
      window.open(url, target);
    } else {
    }
  } catch {
  }
};

export { escapeHtml, safeRedirect };
