import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useErrors from "src/hooks/useErrors";
import fetchUser from "src/utils/fetchUser";

const useFetchInvoiceDetails = () => {
  const [invoice, setInvoice] = useState();
  const { id } = useParams();
  const handleErrors = useErrors();
  const fetchData = async (id) => {
    try {
      const { data, status } = await (
        await fetchUser(`my-bb-subscriptions/${id}`)
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
