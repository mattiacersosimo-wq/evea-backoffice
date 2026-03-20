import { PATH_USER } from "src/routes/paths";
import MailList from "../subPages/MailList";
import SelectedMailsProvider from "../subPages/MailList/context";
import useDelete from "./hooks/useDelete";
import useGetUserMail from "./hooks/useGetUserMail";

const linkTo = (params, mailId) => {
  const { systemLabel, customLabel } = params;

  const baseUrl = PATH_USER.mail.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  return baseUrl;
};

const UserMailList = () => {
  const { mails, fetchMails } = useGetUserMail();
  const deleteMail = useDelete();
  return (
    <SelectedMailsProvider>
      <MailList
        mails={mails}
        fetchMails={fetchMails}
        deleteMail={deleteMail}
        linkTo={linkTo}
      />
    </SelectedMailsProvider>
  );
};
export default UserMailList;
