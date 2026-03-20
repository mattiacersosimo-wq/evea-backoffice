import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";

const useGetPackages = () => {
  const methods = useForm();
  const { control } = methods;
  const field = useFieldArray({
    control,
    name: "package",
  });

  const { replace } = field;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("api/admin/roi-package");
        replace(
          data.data.map(({ name, id, roi_plan_package }) => {
            const obj = { name, product_id: id };

            if (roi_plan_package) {
              obj.percentage = roi_plan_package?.percentage;
            } else {
              obj.percentage = 0;
            }

            return obj;
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return { methods, field };
};

export default useGetPackages;
