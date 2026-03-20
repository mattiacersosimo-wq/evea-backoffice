const isAdmin = () => Boolean(JSON.parse(localStorage.getItem("isAdmin")));

export default isAdmin;
