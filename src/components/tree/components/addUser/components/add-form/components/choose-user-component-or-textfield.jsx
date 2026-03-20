import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Ternary from "src/components/ternary";
import Users from "src/components/users";
import useIsUser from "src/hooks/use-is-user";
import useAuth from "src/hooks/useAuth";

const ChooseUserComponentOrTextField = () => {
    const { user } = useAuth();
    const isUser = useIsUser();
    const { t } = useTranslation();

    return (
        <Ternary
            when={isUser}
            then={
                <TextField
                    value={user.username}
                    label={t("genealogy.add.referral")}
                />
            }
            otherwise={
                <Users
                    type="network"
                    name="referral"
                    label="genealogy.add.referral"
                />
            }
        />
    );
};

export default ChooseUserComponentOrTextField;
