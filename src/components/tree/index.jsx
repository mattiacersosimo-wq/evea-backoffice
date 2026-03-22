import { Box, Chip, Grid, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import useGetTree from "src/hooks/useGetTree";
import Legend from "./components/legend";
import SearchByUser from "./components/search";
import TreeWrapper from "./components/treeWrapper";
import View from "./components/view";
import Styles from "./style.module.css";

const SPONSOR_LEGEND = [
  { label: "Cliente", color: "#378ADD" },
  { label: "Associate", color: "#9E9E9E" },
  { label: "Rank 1", color: "#8BC34A" },
  { label: "Rank 2", color: "#4CAF50" },
  { label: "Rank 3", color: "#00897B" },
  { label: "Rank 4", color: "#B8963B" },
  { label: "Rank 5+", color: "#9C27B0" },
];

const Tree = ({ legends = [], username, ...rest }) => {
    return (
        <>
            <View {...rest} />
            <Legend username={username} legends={legends} />
        </>
    );
};

export const TreeWithoutLegend = ({ links, title, url, ...props }) => {
    const getTree = useGetTree(url);

    return (
        <TreeWrapper title={title} links={links}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <SearchByUser search={getTree.onSearch} />
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                    {SPONSOR_LEGEND.map((l) => (
                        <Chip
                            key={l.label}
                            label={l.label}
                            size="small"
                            sx={{
                                height: 22, fontSize: "0.65rem", fontWeight: 600,
                                bgcolor: alpha(l.color, 0.1), color: l.color,
                                border: `1px solid ${alpha(l.color, 0.3)}`,
                                "& .MuiChip-label": { px: 1 },
                            }}
                            icon={<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: l.color, ml: "8px !important" }} />}
                        />
                    ))}
                </Stack>
            </Box>
            <Tree {...props} {...getTree} />
        </TreeWrapper>
    );
};

export const TreeWithLegend = ({ links, title, url, ...props }) => {
    const getTree = useGetTree(url);

    return (
        <TreeWrapper title={title} links={links}>
            <Box
                className={Styles.binary_tree}
                sx={{
                    backgroundColor: "background.paper",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        marginBottom: 2,
                    }}
                >
                    <SearchByUser search={getTree.onSearch} />
                </Box>
                <Grid container spacing={2}>
                    <Tree {...props} {...getTree} />
                </Grid>
            </Box>
        </TreeWrapper>
    );
};

export default Tree;
