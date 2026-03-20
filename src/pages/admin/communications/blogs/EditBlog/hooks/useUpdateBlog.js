import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import axiosInstance from "src/utils/axios";
import { genReqData } from "../../NewBlog/hooks/useAddPost";
import useGetBlogById from "./useGetBlogById";

const useUpdateBlog = () => {
  const navigate = useNavigate();
  const methods = useGetBlogById();
  const { bid } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit =
    (isDraft = false) =>
    async (inputData) => {
      const reqData = genReqData(inputData);
      reqData.set("is_draft", isDraft ? 1 : 0);
      reqData.append("_method", "PUT");
      try {
        const { status, data } = await axiosInstance.post(
          `api/admin/blogs/${bid}`,
          reqData
        );
        if (status === 200) {
          enqueueSnackbar(data.message);
          if (isDraft) {
            navigate(PATH_DASHBOARD.communication.draft_blog);
          } else {
            navigate(PATH_DASHBOARD.communication.blog);
          }
        }
      } catch (err) {
        Object.values(err.errors).flatMap((item) =>
          enqueueSnackbar(item, { variant: "error" })
        );
      }
    };

  return { methods, onSubmit };
};

export default useUpdateBlog;
