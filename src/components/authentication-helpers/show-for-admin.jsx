import useAuth from "src/hooks/useAuth";

const ShowForAdmin = ({ children }) => {
    const { isAdmin } = useAuth();

    return isAdmin ? children : null;
};

export default ShowForAdmin;
