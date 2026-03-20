import { useState } from "react";

const useOpenAddDialog = () => {
    const [openAdd, setOpenAdd] = useState({ status: false, data: null });

    const handleOpenAdd = (placement_id, leg) =>
        setOpenAdd({ status: true, placement_id, leg });

    const handleCloseAdd = () => setOpenAdd({ status: false, data: null });

    return { openAdd, handleCloseAdd, handleOpenAdd };
};

export default useOpenAddDialog;
