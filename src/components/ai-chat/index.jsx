import { Box, Card, Chip, CircularProgress, Fab, IconButton, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Iconify from "src/components/Iconify";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";

const AiChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(20);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef(null);

  // Only show for promoters
  if (!user || user.is_promoter !== 1) return null;

  const loadHistory = async () => {
    if (historyLoaded) return;
    try {
      const { data: r } = await axiosInstance.get("api/wp/ai-chat/history");
      setMessages(r?.data?.messages || []);
      setRemaining(r?.data?.remaining ?? 20);
      setHistoryLoaded(true);
    } catch { /* silent */ }
  };

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg, created_at: new Date().toISOString() }]);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("message", msg);
      const { data: r } = await axiosInstance.post("api/wp/ai-chat/send", form);
      setMessages((prev) => [...prev, { role: "assistant", content: r?.data?.message || "...", created_at: new Date().toISOString() }]);
      setRemaining(r?.data?.remaining ?? remaining - 1);
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.error || "Errore. Riprova.";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg, created_at: new Date().toISOString() }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && !historyLoaded) loadHistory();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  return (
    <>
      {/* FAB button */}
      {!open && (
        <Fab
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            bgcolor: ORO, color: "#fff", width: 56, height: 56,
            boxShadow: `0 4px 20px ${alpha(ORO, 0.4)}`,
            "&:hover": { bgcolor: "#A07E2F" },
          }}
        >
          <Iconify icon="mdi:robot-happy-outline" width={28} />
        </Fab>
      )}

      {/* Chat window */}
      {open && (
        <Card sx={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: { xs: "calc(100% - 32px)", sm: 380 }, height: 520,
          borderRadius: 4, overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <Box sx={{ bgcolor: ESPRESSO, px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: alpha(ORO, 0.2), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Iconify icon="mdi:robot-happy-outline" width={22} sx={{ color: ORO }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>EVEA Assistant</Typography>
              <Typography sx={{ color: alpha("#fff", 0.5), fontSize: "0.6rem" }}>AI powered • {remaining} messaggi rimasti oggi</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: alpha("#fff", 0.6) }}>
              <Iconify icon="mdi:close" width={20} />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box ref={scrollRef} sx={{ flex: 1, overflow: "auto", px: 2, py: 1.5, bgcolor: "#FAFAFA" }}>
            {messages.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Iconify icon="mdi:robot-happy-outline" width={48} sx={{ color: alpha(ORO, 0.3), mb: 1 }} />
                <Typography sx={{ color: "#aaa", fontSize: "0.8rem", mb: 2 }}>Ciao! Sono il tuo assistente EVEA.</Typography>
                <Stack spacing={1}>
                  {["Come raggiungo il prossimo rank?", "Quanto ho guadagnato?", "Come funziona il Go MVP?"].map((q) => (
                    <Chip key={q} label={q} size="small" onClick={() => { setInput(q); }}
                      sx={{ fontSize: "0.7rem", bgcolor: alpha(ORO, 0.08), color: ESPRESSO, cursor: "pointer", "&:hover": { bgcolor: alpha(ORO, 0.15) } }} />
                  ))}
                </Stack>
              </Box>
            )}
            {messages.map((m, i) => (
              <Box key={i} sx={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", mb: 1 }}>
                <Box sx={{
                  maxWidth: "80%", px: 1.5, py: 1, borderRadius: 2,
                  bgcolor: m.role === "user" ? ORO : "#fff",
                  color: m.role === "user" ? "#fff" : ESPRESSO,
                  border: m.role === "assistant" ? "1px solid #eee" : "none",
                  boxShadow: m.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                }}>
                  <Typography sx={{ fontSize: "0.78rem", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.content}</Typography>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                <CircularProgress size={16} sx={{ color: ORO }} />
                <Typography sx={{ fontSize: "0.7rem", color: "#aaa" }}>Sto pensando...</Typography>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box sx={{ p: 1.5, borderTop: "1px solid #eee", bgcolor: "#fff" }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth size="small" placeholder="Scrivi un messaggio..."
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                disabled={loading || remaining <= 0}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.82rem" } }}
              />
              <IconButton onClick={send} disabled={loading || !input.trim() || remaining <= 0}
                sx={{ bgcolor: ORO, color: "#fff", borderRadius: 2, width: 40, "&:hover": { bgcolor: "#A07E2F" }, "&.Mui-disabled": { bgcolor: "#eee" } }}>
                <Iconify icon="mdi:send" width={18} />
              </IconButton>
            </Stack>
          </Box>
        </Card>
      )}
    </>
  );
};

export default AiChat;
