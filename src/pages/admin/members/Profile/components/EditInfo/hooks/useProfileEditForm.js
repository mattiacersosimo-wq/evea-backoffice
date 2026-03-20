import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useUserForm, {
  NewUserSchema,
} from "src/sections/user/profile/EditInfo/hooks/useUserForm";
import { useMemberProfileContext } from "../../..";

const defaultValues = {
  tax_code: "",
  vat_number: "",
  first_name: "",
  last_name: "",
  mobile: "",
  gender: "",
  zipcode: "",
  address: "",
  country: "",
  state: "",
  city: "",
  facebook: "",
  twitter: "",
  instagram: "",
  telegram: "",
  whatsapp: "",
  profile_image: "",
  email: "",
  medium: "",
};

const useProfileEditForm = () => {
  const { memberProfile } = useMemberProfileContext();
  const methods = useUserForm();

  const { user_profile: user } = memberProfile;
  useEffect(() => {
    methods.reset({
      ...user?.user_profile,
      email: user?.email,
      tax_code: user?.tax_code,
      vat_number: user?.vat_number,
      username: user?.username,
      social: {
        scope_email: user?.user_profile?.scope_email,
        scope_facebook: user?.user_profile?.scope_facebook,
        scope_instagram: user?.user_profile?.scope_instagram,
        scope_medium: user?.user_profile?.scope_medium,
        scope_phone: user?.user_profile?.scope_phone,
        scope_telegram: user?.user_profile?.scope_telegram,
        scope_twitter: user?.user_profile?.scope_twitter,
        scope_whatsapp: user?.user_profile?.scope_whatsapp,
      },
    });
  }, [user]);
  return methods;
};

export default useProfileEditForm;
