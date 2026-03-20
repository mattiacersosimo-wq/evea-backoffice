import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useTicketForm from "../../hooks/useTicketForm";

const useGetTicketById = () => {
  const methods = useTicketForm();
  console.log(methods.formState.errors);
  const [ticketNumber, setTicketNumber] = useState("");
  const { id } = useParams();
  const fetchTicket = async () => {
    try {
      const { status, data } = await axiosInstance.get(
        `/api/admin/support-tickets/${id}`
      );

      if (status === 200) {
        const {
          subject,
          description,
          priority_id,
          category_id,
          department_id,
          status,
          user_id,
          active,
        } = data.data;
        setTicketNumber(data.data.ticket_number);

        methods.reset({
          subject,
          description,
          priority_id,
          category_id,
          department_id,
          status,
          user_id,
          active,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);
  return { methods, ticketNumber };
};

export default useGetTicketById;
