import PaginationButtons from "src/components/pagination";
import { PATH_USER } from "src/routes/paths";
import MailList from "../subPages/MailList";
import SelectedMailsProvider from "../subPages/MailList/context";
import useAllDelete from "./hooks/useAllDelete";
import useDelete from "./hooks/useDelete";
import useGetUserMail from "./hooks/useGetUserMail";
import { useOutletContext, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

const linkTo = (params, mailId) => {
  const { emailLabel, customLabel } = params;

  const baseUrl = PATH_USER.mails.root;

  if (emailLabel) {
    return `${baseUrl}/${emailLabel}/${mailId}`;
  }
  if (customLabel) {
    return `${baseUrl}/label/${customLabel}/${mailId}`;
  }
  return baseUrl;
};

const UserMailList = () => {
  const { mails, fetchMails, pagination } = useGetUserMail();
  const { fetchData } = useOutletContext();
  const deleteMail = useDelete(fetchData);
  const allMailDelete = useAllDelete(fetchData);

  return (
    <SelectedMailsProvider>
      
      <MailList
        mails={mails}
        fetchMails={fetchMails}
        deleteMail={deleteMail}
        linkTo={linkTo}
        allMailDelete={allMailDelete}
        pagination={pagination}
      />
    </SelectedMailsProvider>
  );
};
export default UserMailList;
