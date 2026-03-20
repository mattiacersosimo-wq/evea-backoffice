export const genReqData = (inputData) => {
  const reqData = new FormData();
  [...Object.entries(inputData)].forEach(([key, value]) =>
    reqData.append(key, value)
  );

  return reqData;
};

export const handleErrors = (openSnackbar) => (error) => {
  [...Object.values(error)].forEach((value) =>
    openSnackbar(value, { variant: "error" })
  );
};
