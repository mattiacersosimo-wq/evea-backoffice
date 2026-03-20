import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

const serializeData = (list = []) => {
    const formattedData = list?.map(
        ({ id, type, input_label, input_type, status, required, unique }) => {
            return {
                pk: id,
                input_label,
                input_type,
                type,
                status: status || 0,
                required: required || 0,
                unique: unique || 0,
            };
        }
    );
    const mandatory = formattedData?.filter(({ type }) => type !== "custom");
    const custom = formattedData?.filter(({ type }) => type === "custom");
    return test(mandatory, custom);
};

const test = (arrOne, arrTwo) => {
    let i = 0;
    while (i < arrOne.length) {
        arrOne[i].index = i;
        i++;
    }
    for (let j = 0; j < arrTwo.length; j++) {
        arrTwo[j].index = i;
        i++;
    }
    return [arrOne, arrTwo];
};

const defaultValues = { mandatory: [], custom: [] };

const useMembershipSettings = () => {
    const methods = useForm({ defaultValues });
    const { enqueueSnackbar } = useSnackbar();
    const mandatoryArray = useFieldArray({
        control: methods.control,
        name: "mandatory",
    });

    const customArray = useFieldArray({
        control: methods.control,
        name: "custom",
    });
    const [dataStatus, setDataStatus] = useState({
        loading: false,
        error: false,
    });
    const fetchMembershipPackages = async () => {
        setDataStatus((prevState) => ({ ...prevState, loading: true }));
        customArray.replace([]);
        mandatoryArray.replace([]);
        try {
            const { data } = await axiosInstance.get(
                "api/admin/registration-settings"
            );

            const [mandatory, custom] = serializeData(data?.data);
            customArray.replace(custom);
            mandatoryArray.replace(mandatory);
            setDataStatus(() => ({
                loading: false,
                error: false,
            }));
        } catch (err) {
            setDataStatus(() => ({
                loading: false,
                error: true,
            }));
            console.log(err);
        }
    };
    useEffect(() => {
        fetchMembershipPackages();
    }, []);

    const update = async (type, inputData) => {
        const reqData = new FormData();
        Object.entries({ ...inputData, _method: "PUT" }).forEach(([k, v]) =>
            reqData.append(k, v)
        );

        try {
            const { data } = await axiosInstance.post(
                `api/admin/registration-settings/${inputData.pk}`,
                reqData
            );

            if (type === "mandatory") {
                const updateIndex = mandatoryArray.fields.findIndex(
                    ({ pk }) => pk === inputData.pk
                );
                mandatoryArray.update(updateIndex, inputData);
            } else {
                const updateIndex = customArray.fields.findIndex(
                    ({ pk }) => pk === inputData.pk
                );
                customArray.update(updateIndex, inputData);
            }
            enqueueSnackbar(data.message);
        } catch (err) {
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };
    return {
        dataStatus,
        methods,
        mandatoryArray,
        customArray,
        update: update,
        fetchMembershipPackages,
    };
};

export default useMembershipSettings;
