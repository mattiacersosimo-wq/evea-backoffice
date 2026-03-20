import useGetMails from "../../hooks/useGetMails";

export const useGetUserMail = () => useGetMails("api/user/mail");
export default useGetUserMail;
