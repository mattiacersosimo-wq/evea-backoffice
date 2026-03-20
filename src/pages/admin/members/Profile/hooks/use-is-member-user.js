import { useMemberProfileContext } from "..";

const useIsMemberUser = () => {
  const { memberProfile } = useMemberProfileContext();

  if (Object.keys(memberProfile?.user_profile).length > 0) {
    return !memberProfile?.user_profile?.is_sub_admin;
  }
  return false;
};

export default useIsMemberUser;
