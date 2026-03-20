const exportData = (menu = {}, file_name = "unknown") => {
  Object.entries(menu).forEach(([k, v]) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(v)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${file_name}_${k}.json`;
    link.click();
  });
};

export default exportData;
