import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "src/utils/axios";
import { object } from "yup";

const useMaterialEdit = ({
  reset,
  path,
  defaultValues,
  schema = object().shape({}),
}) => {
  const [editId, setEditId] = useState(null);
  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const fetchMaterialDoc = async (id) => {
    if (id) {
      const URI = `${path}/${id}`;
      try {
        const { data } = await axiosInstance.get(URI);
        const { status, data: documents } = data;
        if (status) {
          const { doc_url, ...rest } = documents;
          methods.reset(rest);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchMaterialDoc(editId);
  }, [editId]);

  const openEdit = (id) => () => {
    setEditId(id);
  };

  const closeEdit = () => setEditId(null);

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = (route) => async (inputData) => {
    const { doc, ...rest } = inputData;
    const reqData = new FormData();
    Object.entries(rest).forEach(([k, v]) => reqData.append(k, v));
    reqData.append("_method", "PUT");
    if (doc?.length) {
      reqData.append("doc", doc[0]);
    }
    const URI = `${route}/${editId}`;

    const { data, status } = await axiosInstance.post(URI, reqData);
    if (status === 200) {
      reset();
      closeEdit();
      enqueueSnackbar(data.message);
    }
  };

  return {
    isEditOpen: Boolean(editId),
    openEdit,
    closeEdit,
    onSubmit,
    methods,
  };
};

export default useMaterialEdit;
