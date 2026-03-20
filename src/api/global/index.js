import visitorServer from "src/utils/visitor";

const addVisitor = async (data) => {
  const reqData = new FormData();
  const { countryCode, ...rest } = data;

  Object.entries(rest).forEach(([k, v]) => reqData.append(k, v));
  // reqData.append("mobile", `${countryCode}${mobile}`);
  try {
    const { data, status } = await visitorServer.post("/register", reqData);

    if (status === 200) return { ...data };
  } catch (err) {
    return { err };
  }
};

export default addVisitor;
