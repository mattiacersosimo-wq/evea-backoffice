import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import RHFAutoComplete from "src/components/hook-form/RHFAutoComplete";
import useAdminGroupsList from "src/components/ProductAutoComplete/hooks/useAdminGroupsList";

const AdminGroups = () => {
  const { t } = useTranslation();
  const options = useAdminGroupsList();
  const { getValues } = useFormContext();
  if (options.length) {
    const selectedValue = options.find(
      ({ id }) => getValues("group_id") === id
    );
    if (selectedValue)
      return (
        <RHFAutoComplete
          defaultValue={selectedValue}
          name="group_id"
          label={t("sub_admin.group")}
          options={options}
          getOptionLabel={(option) => option.name}
        />
      );
  }

  return null;
};

export default AdminGroups;
