import { Box, Card, Stack, Typography, Avatar, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import useAuth from "src/hooks/useAuth";
import FounderBadge from "src/components/FounderBadge";
import useFounderStatus from "src/hooks/useFounderStatus";
import ProfileTabs from "./components/profile-tabs";

const ORO = "#B8963B";
const ESPRESSO = "#2C1A0E";
const MUTED = "#7A6A5C";

const UserProfile = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isIt = i18n.language?.startsWith("it");
  const profile = user?.user_profile || {};
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || user?.username || "";
  const { is_founder: isFounder, founder_number: founderNumber } = useFounderStatus();

  return (
    <Page title={isIt ? "Il mio Profilo" : "My Profile"}>
      <Box sx={{ px: { xs: 2, md: 3 }, pb: 4 }}>
        {/* Hero card */}
        <Card sx={{
          background: `linear-gradient(135deg, #FAF6EF 0%, #F5EEDE 60%, #F0E7CF 100%)`,
          color: ESPRESSO, borderRadius: 3, p: { xs: 2.5, md: 3 }, mb: 3,
          position: "relative", overflow: "hidden",
          border: `1px solid ${alpha(ORO, 0.25)}`,
          boxShadow: `0 2px 16px ${alpha(ORO, 0.08)}`,
        }}>
          <Box sx={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.12)} 0%, transparent 70%)` }} />
          <Box sx={{ position: "absolute", top: -60, left: "30%", width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(ORO, 0.08)} 0%, transparent 70%)`, pointerEvents: "none" }} />
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ xs: "center", md: "flex-start" }} sx={{ position: "relative", zIndex: 1 }}>
            <Avatar src={profile.profile_image} sx={{
              width: 88, height: 88,
              bgcolor: "#fff", color: ORO, fontSize: 32, fontWeight: 800,
              border: `3px solid ${alpha(ORO, 0.4)}`,
              boxShadow: `0 0 0 6px ${alpha(ORO, 0.08)}, 0 4px 12px ${alpha(ORO, 0.2)}`,
            }}>
              {fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, width: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" sx={{ mb: 0.5 }}>
                <Typography variant="h5" fontWeight={700} color={ESPRESSO}>{fullName}</Typography>
                {user?.is_promoter === 1 && (
                  <Chip label={isIt ? "Promoter" : "Promoter"} size="small" sx={{
                    bgcolor: alpha(ORO, 0.12), color: ORO,
                    fontWeight: 700, fontSize: "0.72rem", height: 24,
                    border: `1px solid ${alpha(ORO, 0.3)}`,
                  }} />
                )}
              </Stack>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ color: MUTED }}>
                {user?.username && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon="mdi:at" width={16} />
                    <Typography sx={{ fontSize: "0.82rem" }}>{user.username}</Typography>
                  </Stack>
                )}
                {user?.email && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon="mdi:email-outline" width={16} />
                    <Typography sx={{ fontSize: "0.82rem" }}>{user.email}</Typography>
                  </Stack>
                )}
                {profile?.mobile && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Iconify icon="mdi:phone-outline" width={16} />
                    <Typography sx={{ fontSize: "0.82rem" }}>{profile.mobile}</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            {isFounder && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FounderBadge number={founderNumber} size={80} />
              </Box>
            )}
          </Stack>
        </Card>

        {/* Tabs card */}
        <Card sx={{
          borderRadius: 3, mb: 3,
          border: "1px solid #f0ece6",
          boxShadow: "0 1px 3px rgba(44, 26, 14, 0.04)",
          overflow: "hidden",
          position: "relative",
          minHeight: 56,
          "& > div": { position: "relative !important" },
        }}>
          <ProfileTabs />
        </Card>

        <Outlet />
      </Box>
    </Page>
  );
};

export default UserProfile;
