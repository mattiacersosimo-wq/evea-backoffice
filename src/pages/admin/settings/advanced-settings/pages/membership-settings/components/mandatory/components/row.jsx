import { Switch, TableCell, TableRow } from "@mui/material";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const Row = ({ data, onChange, move }) => {
    const { input_label, input_type, status, index, required, pk } = data;
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
                    onChange={onChange("mandatory", pk)}
                />
            </TableCell>
            {/*<TableCell>
        <Switch
          name="unique"
          checked={Boolean(unique)}
          onChange={onChange("mandatory", pk)}
        />
      </TableCell>*/}
            <TableCell>
                <Switch
                    name="required"
                    checked={Boolean(required)}
                    onChange={onChange("mandatory", pk)}
                />
            </TableCell>
        </TableRow>
    );
};

export default Row;
