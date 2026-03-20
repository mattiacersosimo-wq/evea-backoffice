import { useSnackbar } from "notistack";
import axiosInstance from "src/utils/axios";
import URI from "src/utils/urlConfig";
import useGroupForm, {
  groupDefaultValues,
} from "../../group/hooks/useGroupForm";

const genReqData = (inputData) => {
  const { menu, ...rest } = inputData;
  const reqData = new FormData();
  Object.entries({
    ...rest,
    active: 1,
    permission_string: JSON.stringify([{ items: menu }]),
  }).forEach(([k, v]) => reqData.append(k, v));

  return reqData;
};

const useAdd = (cb) => {
  const methods = useGroupForm();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (inputData) => {
    const reqData = genReqData(inputData);

    const url = URI.admin.subAdmin.group.create;

    try {
      const { status, data } = await axiosInstance.post(url, reqData);
      if (status === 200) {
        cb();
        enqueueSnackbar(data.message);
        methods.reset(groupDefaultValues);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { methods, onSubmit };
};

export default useAdd;
