import fetchUser from "src/utils/fetchUser";

const getEventsList = async (params) => {
  try {
    const { data, status } = await fetchUser(`events-list`, {
      params,
    });
    if (status === 200) return data;
  } catch (err) {
    return err;
  }
};

export const getEventById = async (id) => {
  try {
    const { data, status } = await fetchUser(`dashboard/view-event/${id}`);
    if (status === 200) return data;
  } catch (err) {
    return err;
  }
};

export default getEventsList;
