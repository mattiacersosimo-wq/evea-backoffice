const genReqData = (data) => {
  const { product_id, ...rest } = data;
  const reqData = new FormData();
  [...Object.entries(rest)].map(([key, value]) => reqData.append(key, value));

  if (product_id.length > 0) {
    reqData.append("product_id", JSON.stringify(product_id));
  }

  return reqData;
};

export default genReqData;
