const isSubAdmin = () =>
  Boolean(JSON.parse(localStorage.getItem("isSubAdmin")));
export default isSubAdmin;
