import useIsUser from "src/hooks/use-is-user";

export const HideFromAdmin = ({ children }) => {
    const isUser = useIsUser();
    if (isUser) return <>{children}</>;
    return null;
};

export const HideFromUser = ({ children }) => {
    const isUser = useIsUser();
    if (isUser) return null;

    return <>{children}</>;
};
