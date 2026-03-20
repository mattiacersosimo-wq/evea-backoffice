import useAuth from "src/hooks/useAuth";
import useGetMails from "../../hooks/useGetMails";

const useGetAdminMail = () => {
  const user = useAuth();

  return useGetMails(
    user.isAdmin || user.isSubAdmin ? "api/admin/mail" : "api/user/mail"
  );
};

export default useGetAdminMail;
