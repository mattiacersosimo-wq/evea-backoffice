import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";

const useAddPost = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  return (isDraft = false) =>
    async (inputData) => {
      const reqData = genReqData(inputData);

      reqData.set("is_draft", isDraft ? 1 : 0);
      try {
        const { data } = await axiosInstance.post("/api/admin/blogs", reqData);

        const { status, message } = data;

        if (status) {
          enqueueSnackbar(message);
          sessionStorage.removeItem("editor-content");
          if (isDraft) {
            navigate(PATH_DASHBOARD.communication.draft_blog);
          } else {
            navigate(PATH_DASHBOARD.communication.blog);
          }
        }
      } catch (error) {
        Object.values(error.errors).flatMap((err) =>
          enqueueSnackbar(err, { variant: "error" })
        );
      }
    };
};

export const genReqData = (inputData) => {
  const reqData = new FormData();

  const { document_url, image, product_id, type, category_id, ...rest } =
    inputData;
  Object.entries(rest).forEach(([key, value]) => reqData.append(key, value));

  image.forEach((v) => {
    if (typeof v === "object") {
      reqData.append("blogimage_url", v);
    }
  });

  if (document_url) {
    if (document_url.length) reqData.set("document_url", document_url[0]);
  }

  if (type === 1) {
    product_id.forEach((v) => reqData.append("product_id[]", v));
  }

  reqData.set("category_id", JSON.stringify(category_id));
  reqData.set("type", type);

  return reqData;
};

export default useAddPost;
