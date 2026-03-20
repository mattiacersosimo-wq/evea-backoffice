import useAuth from "./useAuth";

const useIsHoldingTank = () => {
  const { user } = useAuth();
  return Boolean(user?.isHoldingTank);
};

export default useIsHoldingTank;
