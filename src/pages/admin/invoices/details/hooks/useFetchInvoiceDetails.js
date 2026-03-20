import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useFetchInvoiceDetails = () => {
  const [invoice, setInvoice] = useState();
  const { id } = useParams();
  const handleErrors = useErrors();
  const fetchData = async (id) => {
    try {
      const { data, status } = await (
        await axiosInstance(`api/admin/my-orders/${id}`)
      ).data;
      if (status) {
        setInvoice(data);
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return invoice;
};

export default useFetchInvoiceDetails;
