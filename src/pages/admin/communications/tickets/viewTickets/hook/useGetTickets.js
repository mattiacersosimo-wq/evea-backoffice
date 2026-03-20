import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";

const useGetTickets = () => {
  const { id } = useParams();
  const [ticketData, setTicketData] = useState([]);
  const fetchTicket = async () => {
    try {
      const { status, data } = await axiosInstance(
        `/api/admin/support-tickets/${id}`
      );

      if (status) {
        setTicketData(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTicket();
  }, []);
  return { ticketData, fetchTicket };
};

export default useGetTickets;
