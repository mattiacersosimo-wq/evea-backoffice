import { useTranslation } from "react-i18next";
import RHFAutoComplete from "src/components/hook-form/RHFAutoComplete";
import useAdminGroupsList from "src/components/ProductAutoComplete/hooks/useAdminGroupsList";

const AdminGroups = () => {
  const options = useAdminGroupsList();
  const { t } = useTranslation();
  return (
    <RHFAutoComplete
      name="group_id"
      label={t("sub_admin.group")}
      options={options}
      getOptionLabel={(option) => option.name}
    />
  );
};

export default AdminGroups;
