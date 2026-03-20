import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import genFaqReqData from "../../utils/genFaqReqData";
import useFetchFaqById from "./useFetchFaqById";

const useFaqEdit = (id, cb) => {
  const methods = useFetchFaqById(id);
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = genFaqReqData(inputData);
    reqData.append("_method", "PUT");

    const { status, data } = await axiosInstance.post(
      `api/admin/faq/${id}`,
      reqData
    );
    if (status === 200) {
      cb();
      enqueueSnackbar(data.message);
    }

    try {
    } catch (err) {
      Object.values(err).flatMap((item) =>
        enqueueSnackbar(item, { variant: "err" })
      );
    }
  };

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
};

export default useFaqEdit;
