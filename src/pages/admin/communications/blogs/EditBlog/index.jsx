import BlogForm from "../components/BlogForm";
import useUpdateBlog from "./hooks/useUpdateBlog";

const EditBlog = () => {
  const { methods, onSubmit } = useUpdateBlog();
  
  return <BlogForm methods={methods} onSubmit={onSubmit} isEdit />;
};

export default EditBlog;
