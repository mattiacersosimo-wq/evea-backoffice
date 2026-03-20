import { Box, Button, CircularProgress } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmptyTable from "src/components/emptyTable";
import Ternary from "src/components/ternary";
import AddUser from "../addUser";
import Node from "../node";
import useOpenAddDialog from "./hooks/use-open-add-dialog";
import Wrapper from "./wrapper";

const View = ({
    treeData,
    fetchTreeData,
    parentName,
    onNodeClick,
    goBack,
    status,
}) => {
    const { handleCloseAdd, handleOpenAdd, openAdd } = useOpenAddDialog();

    const { loading, success } = status;

    return (
        <>
            <Wrapper>
                {parentName && <Button onClick={goBack}>back</Button>}

                <Ternary
                    when={success}
                    then={
                        <Tree
                            treeData={treeData}
                            onNodeClick={onNodeClick}
                            handleOpenAdd={handleOpenAdd}
                        />
                    }
                    otherwise={
                        <Ternary
                            when={loading}
                            then={
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            }
                            otherwise={<EmptyTable />}
                        />
                    }
                />

                <AddUser
                    addUser={openAdd}
                    onClose={handleCloseAdd}
                    fetchTreeData={fetchTreeData}
                />
            </Wrapper>
        </>
    );
};

const Tree = ({ treeData, onNodeClick, handleOpenAdd }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Node
                openAdd={handleOpenAdd}
                node={treeData}
                onClick={onNodeClick}
            />
        </DndProvider>
    );
};

export default View;
