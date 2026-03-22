import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import Iconify from "src/components/Iconify";
import "./style.css";

// Colori per rank (by rank_name)
const RANK_COLOR_MAP = {
  "Associate": "#9E9E9E",
  "Rank 1": "#8BC34A",
  "Rank 2": "#4CAF50",
  "Rank 3": "#00897B",
  "Rank 4": "#B8963B",
  "Rank 5": "#9C27B0",
  "Rank 6": "#FF5722",
  "Rank 7": "#E91E63",
  "Rank 8": "#673AB7",
  "Rank 9": "#F44336",
  "Rank 10": "#FFD700",
};
const CUSTOMER_COLOR = "#378ADD";
const PROMOTER_DEFAULT = "#B8963B";

const getNodeColor = (node) => {
  if (!node) return "#9E9E9E";
  if (node.user_type === "customer") return CUSTOMER_COLOR;
  if (node.rank_name && RANK_COLOR_MAP[node.rank_name]) return RANK_COLOR_MAP[node.rank_name];
  return PROMOTER_DEFAULT;
};

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
      <TreeView
        propagateSelect
        propagateSelectUpwards
        expandedIds={expandedIds}
        data={flatData}
        className="basic cutomeTree"
        aria-label="basic example tree"
        nodeRenderer={({ element, getNodeProps, level, isExpanded }) => {
          const { have_children, profile_image, username, firstName, user_type, rank_name } =
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
// trigger rebuild
