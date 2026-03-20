import useAuth from "src/hooks/useAuth";
import useLabels from "../../hooks/useLabels";

const useAdminLabels = () => {
  const user = useAuth();

  return useLabels(
    user.isAdmin || user.isSubAdmin
      ? "api/admin/mail/labels"
      : "api/user/mail-user/labels"
  );
};

export default useAdminLabels;
