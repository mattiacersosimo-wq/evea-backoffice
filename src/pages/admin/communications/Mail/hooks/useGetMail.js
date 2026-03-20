import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const useGetMail = () => {
  const { mailId, systemLabel } = useParams();
  const params = useParams();
  const { emailLabel } = params;
  const { isAdmin } = useAuth();
  const [mail, setMail] = useState();
  const handleErrors = useErrors();
  const fetchData = useCallback(async () => {
    // const uri = systemLabel === "sent" ? "mail-sent" : "emails-user";
    const uriAdmin = systemLabel === "sent" ? "sent" : "inbox";
    const uriUser = systemLabel === "sent" ? "sent" : "inbox";
    const uri = isAdmin ? uriAdmin : uriUser;
    const URL = isAdmin
      ? `api/admin/emails-user/${mailId}?label=${uri}`
      : `api/user/emails-user/${mailId}?label=${uri}`;
    try {
      const { status, data } = await axiosInstance.get(URL);

      if (status === 200) {
        setMail(isAdmin ? data.email : data.data);
      }
    } catch (err) {
      console.log(err);
      // handleErrors(err);
    }
  }, [mailId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return mail;
};

export default useGetMail;
