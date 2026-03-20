const genReqData = (data) => {
  const { hr, min, image, product_id, ...rest } = data;
  const reqData = new FormData();
  reqData.append("duration", `${hr}:${min}`);
  reqData.append("img", image[0]);
  if (product_id) {
    product_id?.forEach((v) => reqData.append("product_id[]", v));
  }
  [...Object.entries(rest)].forEach(([key, value]) =>
    reqData.append(key, value)
  );

  return reqData;
};

export default genReqData;
