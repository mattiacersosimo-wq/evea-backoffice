import { createContext, useContext } from "react";
import { Outlet } from "react-router";
import ProfileBanner from "./components/ProfileBanner";
import Wrapper from "./components/Wrapper";
import useMemberProfile from "./hooks/useMemberProfile";

const context = createContext(null);

const { Provider } = context;

export const useMemberProfileContext = () => useContext(context);

const MemberProfile = () => {
  const { fetchMemberProfile, memberProfile, dispatch } = useMemberProfile();

  return (
    <Wrapper>
      <Provider value={{ memberProfile, fetchMemberProfile, dispatch }}>
        <ProfileBanner />

        <Outlet />
      </Provider>
    </Wrapper>
  );
};

export default MemberProfile;
