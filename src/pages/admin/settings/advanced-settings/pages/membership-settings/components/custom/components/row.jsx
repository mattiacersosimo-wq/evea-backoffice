import { IconButton, Switch, TableCell, TableRow } from "@mui/material";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Iconify from "src/components/Iconify";

const Row = ({ data, onChange, openAction, move }) => {
    const { index, pk, input_label, input_type, status, unique, required } =
        data;

    const ref = useRef(null);

    const { id } = data;
    const [, drop] = useDrop({
        accept: "div",
        drop(item) {
            if (!ref.current) {
                return;
            }
            if (item.index === index) {
                return;
            }
            move(item.index, index);
            item.index = index;
        },
    });

    const [, drag] = useDrag(() => ({
        type: "div",
        item: { index, id },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
                item: monitor.getItem(),
            };
        },
    }));

    drag(drop(ref));

    return (
        <TableRow
            ref={ref}
            sx={{
                cursor: "pointer",
            }}
        >
            <TableCell>{index + 1}</TableCell>
            <TableCell>{input_label}</TableCell>
            <TableCell>{input_type}</TableCell>
            <TableCell>
                <Switch
                    name="status"
                    checked={Boolean(status)}
                    onChange={onChange("custom", pk)}
                />
            </TableCell>
            <TableCell>
                <Switch
                    name="unique"
                    checked={Boolean(unique)}
                    onChange={onChange("custom", pk)}
                />
            </TableCell>
            <TableCell>
                <Switch
                    name="required"
                    checked={Boolean(required)}
                    onChange={onChange("custom", pk)}
                />
            </TableCell>
            <TableCell>
                <IconButton size="small" onClick={openAction(pk)}>
                    <Iconify icon="charm:menu-kebab" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export default Row;
