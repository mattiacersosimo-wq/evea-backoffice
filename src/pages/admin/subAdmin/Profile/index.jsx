import React from "react";
import useGetSubAdminProfile from "./hooks/useGetSubAdminProfile";

const SubAdminProfile = () => {
  const adminProfileData = useGetSubAdminProfile();
  return <h1>Sub Admin Profile</h1>;
};

export default SubAdminProfile;
