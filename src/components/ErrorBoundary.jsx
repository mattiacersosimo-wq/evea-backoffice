import { Component } from "react";

/**
 * ErrorBoundary globale — cattura tutti gli errori di render React.
 *
 * Casi principali coperti:
 *   1. ChunkLoadError dopo deploy: il symlink 'current' punta a una release
 *      nuova, i chunk della release precedente non esistono piu' → l'utente
 *      con l'app aperta chiede il vecchio chunk → 404 → React solleva.
 *      Auto-reload una volta (flag sessionStorage per evitare loop).
 *   2. Qualsiasi altro errore di render (campo null, componente rotto, ecc):
 *      fallback UI con pulsante "Ricarica" invece di pagina bianca.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const isChunkError =
      error?.name === "ChunkLoadError" ||
      /loading chunk .* failed/i.test(error?.message || "") ||
      /loading css chunk .* failed/i.test(error?.message || "");

    if (isChunkError) {
      const alreadyReloaded = sessionStorage.getItem("chunk_reload_attempted");
      if (!alreadyReloaded) {
        sessionStorage.setItem("chunk_reload_attempted", Date.now().toString());
        window.location.reload();
        return;
      }
      sessionStorage.removeItem("chunk_reload_attempted");
    }

    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }

  handleReload = () => {
    sessionStorage.removeItem("chunk_reload_attempted");
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isChunkError =
      this.state.error?.name === "ChunkLoadError" ||
      /loading chunk .* failed/i.test(this.state.error?.message || "");

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#FAF6EF",
          color: "#2C1A0E",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 22, marginBottom: 16, color: "#B8963B" }}>
            {isChunkError ? "Nuova versione disponibile" : "Si è verificato un errore"}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 24, color: "#7A6A5C" }}>
            {isChunkError
              ? "Una versione più recente dell'app è stata pubblicata. Ricarica per continuare."
              : "Qualcosa è andato storto durante il caricamento. Ricarica per riprovare."}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              padding: "12px 32px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              background: "#B8963B",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            RICARICA
          </button>
          {!isChunkError && this.state.error?.message && (
            <details style={{ marginTop: 32, fontSize: 11, color: "#999" }}>
              <summary style={{ cursor: "pointer" }}>Dettagli tecnici</summary>
              <pre style={{ textAlign: "left", overflow: "auto", marginTop: 8 }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
