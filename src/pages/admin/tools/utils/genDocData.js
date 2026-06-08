const genDocData = (data) => {
  const reqData = new FormData();
  reqData.append("sort_order", data.sort_order);
  reqData.append("title", data.title);
  reqData.append("language", data.language || "it");
  if (typeof data.document_url !== "string") {
    reqData.append("document_url", data.document_url[0]);
  }

  return reqData;
};

export default genDocData;
