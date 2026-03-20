import React from "react";
import Ternary from "src/components/ternary";
import useIsMemberUser from "../hooks/use-is-member-user";

const ShowOnlyForUser = ({ children }) => {
  const isUser = useIsMemberUser();

  return <Ternary when={isUser} then={children} />;
};

export default ShowOnlyForUser;
