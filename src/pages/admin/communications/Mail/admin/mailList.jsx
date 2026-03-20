import { PATH_DASHBOARD, PATH_USER } from "src/routes/paths";
import MailList from "../subPages/MailList";
import SelectedMailsProvider from "../subPages/MailList/context";
import useGetAdminMail from "./hooks/useAdminMail";
import useDelete from "./hooks/useDelete";
import useDeleteAllMail from "./hooks/useDeleteAllMail";

const linkTo = (params, mailId, isAdmin) => {
  const { systemLabel, customLabel } = params;

  const baseUrl = isAdmin ? PATH_DASHBOARD.mail.root : PATH_USER.mail.root;

  if (systemLabel) {
    return `${baseUrl}/${systemLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  return baseUrl;
};

const AdminMailList = () => {
  const {
    state,
    selectedMails,
    setSelectedMails,
    fetchMails,
    pagination,
    isRefreshLoading,
    setRefreshIsLoading,
  } = useGetAdminMail();
  const { data, ...dataProps } = state;

  const deleteMail = useDelete();
  const deleteAllMail = useDeleteAllMail();

  return (
    <SelectedMailsProvider>
      <MailList
        selectedMails={selectedMails}
        setSelectedMails={setSelectedMails}
        setRefreshIsLoading={setRefreshIsLoading}
        isRefreshLoading={isRefreshLoading}
        dataProps={dataProps}
        mails={data}
        fetchMails={fetchMails}
        deleteMail={deleteMail}
        linkTo={linkTo}
        allMailDelete={deleteAllMail}
        pagination={pagination}
      />
    </SelectedMailsProvider>
  );
};
export default AdminMailList;
