import { useForm } from "react-hook-form";

const defaultValues = {
  referral_bonus: "",
  registration: "",
  purchase: "",
};

const useSettingsForm = () => {
  const methods = useForm({ defaultValues });

  return methods;
};

export default useSettingsForm;
