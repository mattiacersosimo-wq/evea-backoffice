import LoginForm from "src/pages/auth/Login/components/MainSection/login";
import AuthLayout from "./components/auth-layout";
import Message from "./components/message";
import NoAccountSection from "./components/no-account-section";

const MainSection = () => {
  return (
    <AuthLayout>
      <Message />
      <LoginForm />
      <NoAccountSection />
    </AuthLayout>
  );
};

export default MainSection;
