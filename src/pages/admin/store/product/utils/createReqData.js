const createReqData = (data) => {
  delete data["image_with_ids"];
  const {
    bv,
    price,
    sample_doc,
    doc,
    image,
    life_time_access,
    deleted_image_ids,
    video,
    ...newData
  } = data;

  const { is_package } = data;

  const isNotPackage = is_package === 0;

  const formData = new FormData();
  Object.entries(newData).forEach(([key, value]) =>
    formData.append(key, value)
  );
  image.forEach((v) => formData.append("image[]", v));
  deleted_image_ids?.forEach((v) => formData.append("deleted_images_id[]", v));

  if (isNotPackage) formData.set("video", video);

  if (isNotPackage)
    formData.set("sample_doc", sample_doc?.length > 0 ? sample_doc[0] : "");
  if (isNotPackage) formData.set("doc", doc?.length > 0 ? doc[0] : "");

  if (isNotPackage) {
    Object.entries(price).forEach(([key, value]) => {
      if (value) formData.append(`price[${key}]`, value);
    });
  } else {
    formData.append("price[]", price);
  }

  return formData;
};

export default createReqData;
