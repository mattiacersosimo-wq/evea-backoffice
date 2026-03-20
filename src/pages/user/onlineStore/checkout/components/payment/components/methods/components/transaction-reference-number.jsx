import { Box, Collapse } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import ReactQuill from "react-quill";
import { RHFTextField } from "src/components/hook-form";
import { TYPE_IDS } from "src/utils/types";

const TransactionReferenceNumber = ({ name, bankDetails }) => {
    const { watch } = useFormContext();
    return (
        <Collapse in={watch(name) === TYPE_IDS.bankPayment}>
            <Box
                sx={{
                    padding: 3,
                }}
            >
                <ReactQuill
                    theme="bubble"
                    modules={{
                        toolbar: null,
                    }}
                    readOnly
                    value={bankDetails?.bank_account_details}
                />{" "}
                <RHFTextField
                    label="Transaction reference no"
                    name="transaction_reference_no"
                />
            </Box>
        </Collapse>
    );
};

export default TransactionReferenceNumber;
