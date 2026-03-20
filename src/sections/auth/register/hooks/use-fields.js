import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

const useFields = () => {
    const [fields, setFields] = useState(() => {
        const regConfig = localStorage.getItem("reg-config");
        if (regConfig) return JSON.parse(regConfig || "[]");

        return [];
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosInstance.get(
                    "api/registration-settings"
                );

                const fields = data?.data || [];
                localStorage.setItem("reg-config", JSON.stringify(fields));
                setFields(fields);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    return fields;
};

export default useFields;
