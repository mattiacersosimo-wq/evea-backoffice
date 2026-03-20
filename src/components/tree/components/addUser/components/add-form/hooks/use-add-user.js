import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useIsUser from "src/hooks/use-is-user";
import useAuth from "src/hooks/useAuth";
import axiosInstance from "src/utils/axios";
import * as Yup from "yup";

const schema = Yup.object({
    referral: Yup.string().required("Referral ID is required"),

    //username: Yup.string().required("Username is required"),
    //name: Yup.string().required("Name is required"),
    //email: Yup.string().required("Email is required"),
    //password: Yup.string()
    //    .min(8, "Password must be at least 8 characters")
    //    .required("Password is required"),
    //confirmPassword: Yup.string()
    //    .oneOf([Yup.ref("password"), null], "Passwords must match")
    //    .required("Confirm password is required"),
});

const defaultValues = {
    referral: "",
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const useAddUser = (addUser, onSuccess = () => null) => {
    const { isAdmin, user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const isUser = useIsUser();

    const methods = useForm({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    const { reset, setError, setValue } = methods;

    useEffect(() => {
        if (isUser) {
            setValue("referral", user.id);
        }
    }, [isUser, user]);

    const onSubmit = async (inputData) => {
        const reqData = new FormData();

        Object.entries({ ...inputData, ...addUser }).forEach(([key, value]) =>
            reqData.append(key, value || "")
        );
        try {
            const { status } = await axiosInstance.post(
                isAdmin ? "api/admin/genealogy" : "api/user/genealogy",
                reqData
            );

            if (status === 200) {
                enqueueSnackbar("Successfully created the user");
                reset({ ...defaultValues, referral: user.id });
                onSuccess();
            }
        } catch (err) {
            Object.entries(err.errors).forEach(([k, v]) =>
                setError(k, { message: v[0] })
            );
        }
    };

    return { methods, onSubmit };
};

export default useAddUser;
