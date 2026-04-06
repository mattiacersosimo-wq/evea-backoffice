export default function CustomerCommunityBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #2C1A0E, #3D2510)",
        borderRadius: "14px",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid rgba(184,150,59,0.15)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "80px",
          background:
            "radial-gradient(ellipse, rgba(184,150,59,0.1), transparent)",
        }}
      />

      <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌿</div>

      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "20px",
          color: "#B8963B",
          fontStyle: "italic",
          marginBottom: "6px",
        }}
      >
        Benvenuto nella famiglia EVEA
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "rgba(250,246,239,0.45)",
          lineHeight: 1.6,
          marginBottom: "20px",
        }}
      >
        Condividi il tuo rituale, scopri ricette e connettiti
        <br />
        con la community di appassionati EVEA.
      </div>

      <a
        href="https://community.myevea.com"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          padding: "12px 28px",
          background: "rgba(184,150,59,0.15)",
          border: "1px solid rgba(184,150,59,0.4)",
          color: "#B8963B",
          textDecoration: "none",
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "13px",
          letterSpacing: "1px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        SCOPRI LA COMMUNITY →
      </a>

      <div
        style={{
          fontSize: "11px",
          color: "rgba(250,246,239,0.25)",
          marginTop: "12px",
        }}
      >
        Stesse credenziali del backoffice
      </div>
    </div>
  );
}
