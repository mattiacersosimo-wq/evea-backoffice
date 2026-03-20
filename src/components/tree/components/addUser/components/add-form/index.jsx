import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogActions, DialogContent } from "@mui/material";
import { FormProvider } from "src/components/hook-form";
import Map from "src/components/map";
import PickField from "src/sections/auth/register/components/pick-fields";
import useFields from "src/sections/auth/register/hooks/use-fields";
import ChooseUserComponentOrTextField from "./components/choose-user-component-or-textfield";
import useAddUser from "./hooks/use-add-user";

const HideComponent = ({ id, children }) => {
    const HIDDEN_IDS = [5];

    if (HIDDEN_IDS.indexOf(id) < 0) {
        return <>{children}</>;
    }

    return null;
};
const AddForm = ({ addUser, onClose, fetchTreeData }) => {
    const { methods, onSubmit } = useAddUser(addUser, () => {
        onClose();
        fetchTreeData();
    });

    const fields = useFields();

    const {
        formState: { isSubmitting },
    } = methods;

    return (
        <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
        >
            <DialogContent>
                <Box
                    sx={{
                        display: "grid",
                        rowGap: 3,
                        columnGap: 2,
                        marginTop: 3,
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                        },
                    }}
                >
                    <ChooseUserComponentOrTextField />

                    <Map
                        list={fields}
                        render={({
                            id,
                            input_label,
                            input_type,
                            input_name,
                            input_options,
                        }) => {
                            return (
                                <HideComponent id={id}>
                                    <PickField
                                        key={input_name}
                                        label={input_label}
                                        name={input_name}
                                        type={input_type}
                                        inputOptions={input_options}
                                    />
                                </HideComponent>
                            );
                        }}
                    />

                    {/*                    
                    <RHFTextField
                        name="username"
                        label="genealogy.add.username"
                    />
                    <RHFTextField
                        name="name"
                        label="genealogy.add.first_name"
                    />
                    <RHFTextField name="email" label="genealogy.add.email" />
                    <Password name="password" label="genealogy.add.password" />

                    <Password
                        name="confirmPassword"
                        label="genealogy.add.confirm_password"
                    />*/}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} autoFocus name="close" color="error">
                    Close
                </Button>
                <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    name="add-user"
                >
                    Submit
                </LoadingButton>
            </DialogActions>
        </FormProvider>
    );
};

export default AddForm;
