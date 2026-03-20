import useGetMails from "../../hooks/useGetMails";

export const useGetAdminMail = () => useGetMails("api/admin/mail");
export default useGetAdminMail;
