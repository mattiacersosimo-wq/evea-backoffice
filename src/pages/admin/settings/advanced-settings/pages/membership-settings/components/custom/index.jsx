import {
    Box,
    Button,
    Card,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableContainer,
    Typography,
} from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Iconify from "src/components/Iconify";
import EmptyTable from "src/components/emptyTable";
import Map from "src/components/map";
import Ternary from "src/components/ternary";
import Header from "./components/header";
import Row from "./components/row";

const Custom = ({
    fields = [],
    handleChange,
    openAction,
    handleOpenAdd,
    dataStatus,
    move,
}) => {
    const { loading, error } = dataStatus;
    return (
        <Card sx={{ p: 3, mt: 3 }}>
            <Stack
                mb={3}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography gutterBottom variant="subtitle1">
                    Custom
                </Typography>

                <Button
                    onClick={handleOpenAdd}
                    variant="contained"
                    startIcon={<Iconify icon="ion:add" />}
                >
                    add
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <Header />
                    <TableBody>
                        <DndProvider backend={HTML5Backend}>
                            <Map
                                list={fields}
                                render={(data) => {
                                    return (
                                        <Row
                                            move={move}
                                            data={data}
                                            onChange={handleChange}
                                            openAction={openAction}
                                        />
                                    );
                                }}
                            />
                        </DndProvider>
                    </TableBody>
                </Table>
                <Ternary
                    when={loading}
                    then={
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 3,
                                marginBottom: 3,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    }
                    otherwise={
                        <Ternary
                            when={fields.length === 0}
                            then={<EmptyTable error={error} />}
                        />
                    }
                />
            </TableContainer>
        </Card>
    );
};

export default Custom;
