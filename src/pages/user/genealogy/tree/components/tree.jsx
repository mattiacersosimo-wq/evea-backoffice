import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import Iconify from "src/components/Iconify";
import "./style.css";

// Colori per rank
const RANK_COLORS = {
  1: "#9E9E9E",   // Associate - grigio
  2: "#8BC34A",   // Rank 1 - verde chiaro
  3: "#4CAF50",   // Rank 2 - verde
  4: "#2196F3",   // Rank 3 - blu
  5: "#B8963B",   // Rank 4 - oro
  6: "#9C27B0",   // Rank 5 - viola
  7: "#FF5722",   // Rank 6 - arancione
  8: "#E91E63",   // Rank 7 - rosa
  9: "#673AB7",   // Rank 8 - viola scuro
  10: "#F44336",  // Rank 9 - rosso
  11: "#FFD700",  // Rank 10 - gold
};
const CUSTOMER_COLOR = "#378ADD";
const PROMOTER_DEFAULT = "#B8963B";

const getNodeColor = (node) => {
  if (!node) return "#9E9E9E";
  if (node.user_type === "customer") return CUSTOMER_COLOR;
  if (node.rank_id && RANK_COLORS[node.rank_id]) return RANK_COLORS[node.rank_id];
  return PROMOTER_DEFAULT;
};

const LEGEND_ITEMS = [
  { label: "Cliente", color: CUSTOMER_COLOR },
  { label: "Associate", color: RANK_COLORS[1] },
  { label: "Rank 1", color: RANK_COLORS[2] },
  { label: "Rank 2", color: RANK_COLORS[3] },
  { label: "Rank 3", color: RANK_COLORS[4] },
  { label: "Rank 4", color: RANK_COLORS[5] },
  { label: "Rank 5+", color: RANK_COLORS[6] },
];

export const BasicTreeView = ({
  data,
  search,
  expandedUsers,
  handleExpand,
}) => {
  const theme = useTheme();

  const flatData = useMemo(
    () =>
      flattenTree({
        name: "Root",
        children: [data],
      }),
    [data]
  );

  const expandedIds = useMemo(() => {
    if (expandedUsers?.length > 0) {
      return expandedUsers
        .map((user) => flatData.find(({ name }) => name.username === user)?.id)
        .filter((v) => v != undefined);
    }
    return [];
  }, [flatData, expandedUsers]);
  return (
    <Box>
      {/* Legend */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, justifyContent: "flex-end" }}>
        {LEGEND_ITEMS.map((l) => (
          <Chip
            key={l.label}
            label={l.label}
            size="small"
            sx={{
              height: 22, fontSize: "0.68rem", fontWeight: 600,
              bgcolor: alpha(l.color, 0.1), color: l.color,
              border: `1px solid ${alpha(l.color, 0.3)}`,
              "& .MuiChip-label": { px: 1 },
            }}
            icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: l.color, ml: "8px !important" }} />}
          />
        ))}
      </Stack>

      <TreeView
        propagateSelect
        propagateSelectUpwards
        expandedIds={expandedIds}
        data={flatData}
        className="basic cutomeTree"
        aria-label="basic example tree"
        nodeRenderer={({ element, getNodeProps, level, isExpanded }) => {
          const { have_children, profile_image, username, firstName, user_type, rank_name, rank_id } =
            element.name || {};

          const hasChildren = element?.children?.length > 0 || have_children;
          const nodeColor = getNodeColor(element.name);

          return (
            <div
              {...getNodeProps()}
              style={{ marginLeft: 1 * (level - 1), position: "relative" }}
            >
              <Stack
                mt={3}
                direction="row"
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Box
                  onClick={() => {
                    if (have_children) {
                      handleExpand(username);
                      search(username);
                    }
                  }}
                  size="small"
                  sx={{
                    backgroundColor: nodeColor,
                    color: "#fff",
                    fontSize: "11px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Iconify
                    icon={
                      hasChildren
                        ? isExpanded
                          ? "ion:chevron-down"
                          : "ion:chevron-right"
                        : user_type === "customer" ? "mdi:account" : "mdi:account-tie"
                    }
                  />
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      borderRadius: "6px",
                      overflow: "hidden",
                      width: "30px",
                      border: `2px solid ${nodeColor}`,
                    }}
                  >
                    <Image imgSrc={profile_image} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "15px",
                        color: theme.palette.widgets?.tertiary?.[450] || "#333",
                        fontWeight: 500,
                        lineHeight: "1.2",
                      }}
                    >
                      {username}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "300",
                          fontSize: "13px",
                          lineHeight: "1",
                          color: theme.palette.widgets?.tertiary?.[600] || "#666",
                        }}
                      >
                        {firstName}
                      </Typography>
                      {rank_name && (
                        <Typography sx={{ fontSize: "10px", fontWeight: 600, color: nodeColor }}>
                          · {rank_name}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </div>
          );
        }}
      />
    </Box>
  );
};

const Image = ({ imgSrc = "" }) => {
  const [src, setSrc] = useState(imgSrc);

  return (
    <img
      src={src}
      onError={(e) => {
        e.stopPropagation();
        setSrc("/icons/geneology/referal-person-fallback.jpg");
      }}
    />
  );
};
