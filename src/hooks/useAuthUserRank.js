import useAuth from "src/hooks/useAuth";

const useAuthUserRank = () => {
  const { user } = useAuth();
  return user?.rank || {};
};

export const useIsEmeraldExecutive = () => {
  const { id } = useAuthUserRank();

  return id === 7;
};

export default useAuthUserRank;
