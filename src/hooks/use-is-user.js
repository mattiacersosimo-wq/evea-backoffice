import useAuth from "./useAuth";

const useIsUser = () => {
  const { isAdmin, isSubAdmin } = useAuth();

  return !(isAdmin || isSubAdmin);
};

export default useIsUser;
