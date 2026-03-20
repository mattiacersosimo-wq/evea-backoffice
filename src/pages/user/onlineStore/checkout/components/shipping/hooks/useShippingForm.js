import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useShippingFormValidation from "./useShippingFormValidation";
import { useEffect } from "react";
import { countries } from "src/components/countries/countries";

const useShippingForm = (cart_id) => {
  const methods = useShippingFormValidation();
  const { reset } = methods;

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const handleErrors = useErrors();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axiosInstance.get("api/user/cart-address");
        const address = data?.data;

        reset({
          shippingAddress: !!address?.shipping_first_name,

          billing_first_name: address?.billing_first_name,
          billing_last_name: address?.billing_last_name,
          billing_country: address?.billing_country_code,
          billing_country_code: address?.billing_country_code,
          billing_street_address: address?.billing_street_address,
          billing_postcode: address?.billing_postcode,
          billing_city: address?.billing_city,
          billing_province: address?.billing_province,
          billing_email: address?.billing_email,
          billing_phone: address?.billing_phone,

          shipping_first_name: address?.shipping_first_name,
          shipping_last_name: address?.shipping_last_name,
          shipping_country: address?.shpping_country_code,
          shpping_country_code: address?.shpping_country_code,
          shipping_street_address: address?.shipping_street_address,
          shipping_postcode: address?.shipping_postcode,
          shipping_city: address?.shipping_city,
          shipping_province: address?.shipping_province,
          shipping_email: address?.shipping_email,
          shipping_phone: address?.shipping_phone,
        });
      } catch (err) {
        handleErrors(err);
      }
    };

    fetchAddress();
  }, [reset]);

  const onSubmit = async (inputData) => {
    const reqData = new FormData();
    const billingCountry = countries.find(
      (country) => country.alpha_3 === inputData?.billing_country,
    );
    const shippingCountry = countries.find(
      (country) => country.alpha_3 === inputData?.shipping_country,
    );

    if (billingCountry) {
      inputData.billing_country_code = billingCountry.alpha_3;
      inputData.billing_country = billingCountry.name;
    }
    if (shippingCountry) {
      inputData.shpping_country_code = shippingCountry.alpha_3;
      inputData.shipping_country = shippingCountry.name;
    }

    cart_id.forEach((id) => {
      reqData.append("cart_ids[]", id);
    });

    Object.entries(inputData).forEach(([key, value]) => {
      reqData.append(key, value);
    });

    try {
      const { status, data } = await axiosInstance.post(
        `api/user/cart-address`,
        reqData,
      );

      if (status === 200) {
        enqueueSnackbar(data.message);
        navigate("/user/checkout/payment");
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  return {
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};

export default useShippingForm;
