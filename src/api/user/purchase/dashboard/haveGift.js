import fetchUser from "src/utils/fetchUser";

export default async () => {
  try {
    const { status, data } = await fetchUser("gift-check");

    if (status === 200) {
      return data;
    }
    return { status: false };
  } catch (err) {
    return { status: false, error: err.error };
  }
};
