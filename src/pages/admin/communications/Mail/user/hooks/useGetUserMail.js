import useGetMails from "../../hooks/useGetMails";

export const useGetUserMail = () => useGetMails("api/user/emails");
export default useGetUserMail;
