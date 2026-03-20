import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import Iconify from "src/components/Iconify";
import "./style.css";

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
  console.log(flatData);
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
          const { have_children, profile_image, username, firstName } =
            element.name || {};

          const hasChildren = element?.children?.length > 0 || have_children;

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
                    backgroundColor: theme.palette.primary.main,
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
                        : "bx:user"
                    }
                  />
                </Box>

                <Stack direction="row" spacing={1}>
                  <Box
                    sx={{
                      borderRadius: "6px",
                      overflow: "hidden",
                      width: "30px",
                    }}
                  >
                    <Image imgSrc={profile_image} />
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "15px",
                        color: theme.palette.widgets.tertiary[450],
                        fontWeight: 300,
                        lineHeight: "1.2",
                      }}
                    >
                      {username}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "300",
                        fontSize: "13px",
                        lineHeight: "1",
                        color: theme.palette.widgets.tertiary[600],
                      }}
                    >
                      {firstName}
                    </Typography>
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
