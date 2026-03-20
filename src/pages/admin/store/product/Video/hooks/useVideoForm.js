import { useEffect } from "react";
import { useForm } from "react-hook-form";

const useVideoForm = (data) => {
  const methods = useForm({ defaultValues: { video_url: "" } });

  useEffect(() => {
    if (data) {
      methods.reset({ video_url: data.video_url, id: data.id });
    }
  }, [data]);

  return methods;
};

export default useVideoForm;

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const ValidationSchema = yup.object().shape({
//   video_url: yup.string().required("Video URL is required"),
// });

// const useVideoForm = (data) => {
//   const methods = useForm({
//     defaultValues: { video_url: "" },
//   });

//   useEffect(() => {
//     if (data) {
//       methods.reset({ video_url: data.video_url, id: data.id });
//     }
//   }, [data]);

//   return useForm({
//     methods,
//     resolver: yupResolver(ValidationSchema),
//   });
// };

// export default useVideoForm;
