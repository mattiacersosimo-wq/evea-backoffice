import Page from "src/components/Page";
import RegisterForm from "src/sections/auth/register";
import Header from "../Login/components/Header";
import AuthLayout from "../Login/components/MainSection/components/auth-layout";
import AlreadyHaveAccount from "./components/already-have-account-section";
import Message from "./components/message";

const Register = () => {
    return (
        <Page
            title="Register"
            sx={{
                height: "auto",
            }}
        >
            <Header login />
            <AuthLayout>
                <Message />
                <RegisterForm />
                <AlreadyHaveAccount />
            </AuthLayout>
        </Page>
    );
};

export default Register;
