import { useState } from "react";
import axiosInstance from "src/utils/axios";

export default function CommunityBanner() {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    // Apriamo subito una scheda vuota per non far scattare il popup blocker:
    // window.open dopo await viene considerato non user-initiated.
    const win = window.open("about:blank", "_blank");
    try {
      const { data } = await axiosInstance.get("api/community/sso");
      const url = data?.url || "https://community.myevea.com";
      if (win && !win.closed) {
        win.opener = null;
        win.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (e) {
      if (win && !win.closed) {
        win.opener = null;
        win.location.href = "https://community.myevea.com";
      } else {
        window.location.href = "https://community.myevea.com";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #2C1A0E, #3D2510)",
        borderRadius: "14px",
        padding: "24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        border: "1px solid rgba(184,150,59,0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(184,150,59,0.08)",
        }}
      />

      <div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "22px",
            fontWeight: 300,
            color: "#B8963B",
            marginBottom: "6px",
            fontStyle: "italic",
          }}
        >
          Community EVEA
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "rgba(250,246,239,0.5)",
            lineHeight: 1.5,
          }}
        >
          Feed post · Corsi di formazione · Gamification · Live call
        </div>
      </div>

      <button
        onClick={handleJoin}
        disabled={loading}
        style={{
          background: "linear-gradient(135deg, #B8963B, #D4B65C)",
          color: "#2C1A0E",
          border: "none",
          padding: "12px 24px",
          borderRadius: "10px",
          fontWeight: 700,
          fontSize: "13px",
          letterSpacing: "1px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
          boxShadow: "0 6px 20px rgba(184,150,59,0.35)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {loading ? "..." : "ENTRA →"}
      </button>
    </div>
  );
}
