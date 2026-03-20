import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import Map from "src/components/map";
import Translate from "src/components/translate";

const headers = ["No", "Label", "Type", "Status", "Required"];

const Header = () => {
    return (
        <TableHead>
            <TableRow>
                <Map
                    list={headers}
                    render={(item) => (
                        <TableCell>
                            <Translate>{item}</Translate>
                        </TableCell>
                    )}
                />
            </TableRow>
        </TableHead>
    );
};

export default Header;
