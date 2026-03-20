import { Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import Ternary from "src/components/ternary";
import { Toolbar } from "./components";
import EmptyMail from "./components/emptyMail";
import Mails from "./components/mails";

const RootStyle = styled("div")({
  flexGrow: 1,
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
});

const MailList = ({ mails, fetchMails, deleteMail, linkTo }) => {
  const [dense, setDense] = useState(false);

  const isEmpty = mails.allIds.length  === 0;

  const handleToggleDense = () => {
    setDense((prev) => !prev);
  };

  return (
    <>
      <RootStyle>
        <Toolbar allIds={mails.allIds} onToggleDense={handleToggleDense} />

        <Divider />

        <Ternary
          when={!isEmpty}
          then={
            <Mails
              deleteMail={deleteMail}
              dense={dense}
              fetchMails={fetchMails}
              linkTo={linkTo}
              mails={mails}
            />
          }
          otherwise={<EmptyMail />}
        />
      </RootStyle>
    </>
  );
};

export default MailList;
