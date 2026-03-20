import { useState } from "react";

const useDelete = () => {
  const [itemId, setItemId] = useState(null);
  const openDelete = (id) => () => setItemId(id);
  const closeDelete = () => setItemId(null);

  return { itemId, openDelete, closeDelete };
};

export default useDelete;
