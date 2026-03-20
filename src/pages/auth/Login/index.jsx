import Page from "src/components/Page";
import Header from "./components/Header";
import MainSection from "./components/MainSection";

const Login = () => {
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
    <Page
      title="Login"
      sx={{
        height: "100%",
      }}
    >
      <Header />
      <MainSection />
    </Page>
  );
};

export default Login;
