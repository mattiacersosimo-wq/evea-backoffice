import { LoadingButton } from "@mui/lab";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from "@mui/material";
import { last } from "lodash";
import { useState } from "react";
import {
    FormProvider,
    RHFSelect,
    RHFTextField,
} from "src/components/hook-form";
import Ternary from "src/components/ternary";
import InputType from "./components/input-type";
// import Type from "./components/type";

const FormDialog = ({ open, onClose, update, title, buttonLabel }) => {
    const { methods, onSubmit } = update;

    const { watch, reset, handleSubmit, setValue } = methods;

    const handleClose = () => {
        reset();
        onClose();
    };

    const [inputType, inputOptions] = watch(["input_type", "input_options"]);
    const [text, setText] = useState("");
    const handleChange = (e) => {
        const { value } = e.target;
        setText(value);
        if (/\s/.test(last(value.split("")))) {
            if (!/^\s/.test(value)) {
                setValue("input_options", [...inputOptions, value.trim()]);
            }
        }
    };

    const { input_options } = methods.formState.errors || {};

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item md={6}>
                            <RHFTextField label="Label" name="input_label" />
                        </Grid>
                        {/* <Grid item md={6}>
              <RHFTextField label="Value" name="value" />
            </Grid> */}
                        <Grid item md={6}>
                            <InputType />
                        </Grid>

                        {/* <Grid item md={6}>
              <RHFTextField label="Input Name" name="input_name" />
            </Grid> */}
                        {/* <Grid item md={6}>
              <Type />
            </Grid> */}
                        <Ternary
                            when={methods.watch("input_name") === "username"}
                            then={
                                <Grid item md={6}>
                                    <RHFSelect label="Dynamic" name="dynamic">
                                        <option value={1}>yes</option>
                                        <option value={0}>no</option>
                                    </RHFSelect>
                                </Grid>
                            }
                        />

                        <Grid item md={6}>
                            <RHFSelect label="Status" name="status">
                                <option value={1}>enabled</option>
                                <option value={0}>disabled</option>
                            </RHFSelect>
                        </Grid>
                        <Grid item md={6}>
                            <RHFSelect label="Required" name="required">
                                <option value={1}>yes</option>
                                <option value={0}>no</option>
                            </RHFSelect>
                        </Grid>
                        <Grid item md={6}>
                            <RHFSelect label="Unique" name="unique">
                                <option value={1}>yes</option>
                                <option value={0}>no</option>
                            </RHFSelect>
                        </Grid>

                        <Ternary
                            when={
                                ["select", "checkbox", "radio"].indexOf(
                                    inputType
                                ) > -1
                            }
                            then={
                                <Grid item md={12}>
                                    <Autocomplete
                                        multiple
                                        options={inputOptions || []}
                                        value={inputOptions || []}
                                        label="Input options"
                                        name="input_options"
                                        size="small"
                                        onChange={(_, v) => {
                                            if (v) {
                                                setValue("input_options", v);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                value={text}
                                                onChange={handleChange}
                                                variant="standard"
                                                label="Input options"
                                                error={Boolean(input_options)}
                                                helperText={
                                                    Boolean(input_options)
                                                        ? input_options?.message
                                                        : "Enter The options separated by space"
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            }
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        close
                    </Button>
                    <LoadingButton
                        loading={methods.formState.isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        {buttonLabel}
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
};

export default FormDialog;
