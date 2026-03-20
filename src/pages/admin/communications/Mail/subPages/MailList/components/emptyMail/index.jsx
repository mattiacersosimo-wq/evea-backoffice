import React from "react";
import EmptyContent from "src/components/EmptyContent";

import emptyMail from "./asset/empty_mail.svg";

const EmptyMail = () => {
  return (
    <EmptyContent
      title={"userHelpCenter.knowledgeBase.thereConversation"}
      img={emptyMail}
      sx={{ flexGrow: 1, height: "auto" }}
    />
  );
};

export default EmptyMail;
