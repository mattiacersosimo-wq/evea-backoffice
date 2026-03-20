import { Box, Grid } from "@mui/material";
import useGetTree from "src/hooks/useGetTree";
import Legend from "./components/legend";
import SearchByUser from "./components/search";
import TreeWrapper from "./components/treeWrapper";
import View from "./components/view";
import Styles from "./style.module.css";

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
            <Box
                sx={{
                    mb: 2,
                }}
            >
                <SearchByUser search={getTree.onSearch} />
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
