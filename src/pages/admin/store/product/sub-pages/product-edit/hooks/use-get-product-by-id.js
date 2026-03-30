import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useParams } from "react-router";
import axiosInstance from "src/utils/axios";
import useProductForm from "../../product-form/hooks/use-product-form";

const useGetProductById = () => {
  const methods = useProductForm();

  const { enqueueSnackbar } = useSnackbar();
  const { pid: id } = useParams();
  useEffect(() => {
    const fetchData = async (productId) => {
      try {
        const { data } = await axiosInstance.get(
          `/api/admin/products/${productId}`
        );

        const {
          active,
          // bv_percentage,
          available_from,
          available_to,
          name,
          meta_keywords,
          product_category_id,
          meta_description,
          short_description,
          title,
          product_url,
          product_videos,
          subscription_type,
          product_payment_types,
          product_description,
          is_package,
          product_prices,
          product_sample_docs,
          product_docs,
          product_images,
        } = data.data;
        let price = null;
        if (is_package === 0) {
          price = product_prices?.reduce((acc, { validity, price }) => {
            return { ...acc, [validity]: price };
          }, {});
        } else {
          price = product_prices?.find(Boolean)?.price || "";
        }

        let euroValue = "";
        let businessVolume = "";
        let qualificationValue = "";
        const values = product_prices?.find(Boolean);
        if (values) {
          euroValue = values.euro_value || "";
          businessVolume = values.business_volume || "";
          qualificationValue = values.qualification_value || "";
        }

        const { sample_doc_url: sample_doc } =
          product_sample_docs?.slice(-1)?.find(Boolean) || {};

        const { doc_url: doc } = product_docs?.slice(-1)?.find(Boolean) || {};
        const image = product_images.map(({ image_url }) => image_url);
        const imageWithIds = product_images.map(({ image_url, id }) => ({
          image_url,
          id,
        }));

        methods.reset({
          active,
          // bv_percentage: bv_percentage ? bv_percentage : "",
          euro_value: euroValue,
          business_volume: businessVolume,
          qualification_value: qualificationValue,
          name,
          meta_description,
          meta_keywords,
          product_category_id,
          product_url: product_url ? product_url : "",
          product_description,
          title,
          short_description,
          price,
          sample_doc,
          doc,
          available_from: moment(available_from),
          available_to: moment(available_to),
          subscription_type:
            JSON.parse(subscription_type) === 1
              ? "subscription"
              : "one-off-payment",
          is_package: is_package ? 1 : 0,
          video: product_videos.length > 0 ? product_videos[0]?.video_url : "",
          payment_types: product_payment_types?.map(({ id }) => id) || [],
          image,
          image_with_ids: imageWithIds,
          deleted_image_ids: [],
        });

        // if (data) {
        //   data.product_prices.forEach((item) => {
        //     price[item.validity] = item.price;
        //     bv[item.validity] = item.business_volume;
        //   });
        //   methods.reset({
        //     ...data,
        //     images: data.product_images,
        //     available_from: convertDMYToMDY(data.available_from),
        //     available_to: convertDMYToMDY(data.available_to),
        //     bv,
        //

        //   setIsLoading(false);
        // }
      } catch (err) {
        enqueueSnackbar("Failed to load data", { variant: "error" });
        console.error(err);
      }
    };

    if (id) {
      fetchData(id);
    }
  }, [id]);

  return methods;
};

export default useGetProductById;
