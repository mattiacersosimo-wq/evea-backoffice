import useGetData from "./use-get-data";

const useSettings = () => {
  const [state, actions, fetchData] = useGetData();
  const { data } = state;

  const handleUpdate = (id) => (e) => {
    const selectedIndex = data.findIndex((item) => item.id === id);
    if (selectedIndex > -1) {
      const selectedItem = data[selectedIndex];

      const { value, name } = e.target;
      selectedItem[name] = value;

      const prev = [...data];
      const temp = [...prev];
      temp.splice(selectedIndex, 1, selectedItem);
      actions.success(temp);
    }
  };

  return { state, handleUpdate, fetchData };
};
export default useSettings;
