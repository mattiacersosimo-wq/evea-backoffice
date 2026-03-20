import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGetMail = () => {
  const { mailId, systemLabel } = useParams();
  const { user } = useAuth();
  const [mail, setMail] = useState();
  const handleErrors = useErrors();
  const fetchData = useCallback(async () => {
    const uri = systemLabel === "sent" ? "mail-sent" : "mail";
    const URL = user.is_super_admin
      ? `api/admin/${uri}/${mailId}`
      : `/api/user/${uri}/${mailId}`;
    try {
      const { status, data } = await axiosInstance.get(URL);
      if (status === 200) setMail(data.data);
    } catch (err) {
      handleErrors(err);
    }
  }, [mailId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return mail;
};

export default useGetMail;
