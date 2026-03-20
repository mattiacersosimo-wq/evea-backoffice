import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
import useGetGroupById from "./useGetGroupById";

const genReqData = (inputData) => {
  const { menu, ...rest } = inputData;
  const reqData = new FormData();
  Object.entries({
    ...rest,
    active: 1,
    permission_string: JSON.stringify([{ items: menu }]),
  }).forEach(([k, v]) => reqData.append(k, v));
  reqData.append("_method", "PUT");
  return reqData;
};

const useEdit = (cb) => {
  const methods = useGetGroupById();
  const { enqueueSnackbar } = useSnackbar();
  const { sid } = useParams();
  const onSubmit = async (inputData) => {
    const reqData = genReqData(inputData);

    const url = URI.admin.subAdmin.group.update(sid);

    try {
      const { status, data } = await axiosInstance.post(url, reqData);
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { methods, onSubmit };
};

export default useEdit;
