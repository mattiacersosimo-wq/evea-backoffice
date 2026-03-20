import { PATH_DASHBOARD } from "src/routes/paths";
import MailList from "../subPages/MailList";
import SelectedMailsProvider from "../subPages/MailList/context";
import useGetAdminMail from "./hooks/useAdminMail";
import useDelete from "./hooks/useDelete";

const linkTo = (params, mailId) => {
  const { systemLabel, customLabel } = params;

  const baseUrl = PATH_DASHBOARD.mail.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  return baseUrl;
};

const AdminMailList = () => {
  const { mails, fetchMails } = useGetAdminMail();
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
export default AdminMailList;
