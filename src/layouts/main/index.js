import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const isSubAdmin = localStorage.getItem("isSubAdmin") === "true";

  if (isSubAdmin) {
    const menu_lists = JSON.parse(localStorage.getItem("menu"));
    const [menu] = menu_lists;
    const { path, children } = menu?.items[0] || {};

    if (path.includes("dashboard")) {
      window.location = children[0]?.path;
      return;
    }
    window.location = path;
    return;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
