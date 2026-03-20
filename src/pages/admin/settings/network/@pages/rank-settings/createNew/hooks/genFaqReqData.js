const genFaqReqData = (inputData) => {
  const reqData = new FormData();
  Object.entries(inputData).forEach(([key, value]) =>
    reqData.append(key, value)
  );
  return reqData;
};

export default genFaqReqData;
