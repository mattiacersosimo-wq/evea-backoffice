import BlogForm from "../components/BlogForm";
import useAddPost from "./hooks/useAddPost";
import useNewBlogForm from "./hooks/useNewBlogForm";

const AddPost = () => {
  const methods = useNewBlogForm();
  const onSubmit = useAddPost();
  return <BlogForm methods={methods} onSubmit={onSubmit} />;
};

export default AddPost;
