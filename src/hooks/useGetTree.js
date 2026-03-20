import { useEffect, useRef, useState } from "react";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";
import useQueryParams from "./useQueryParams";

const useGetTree = (url) => {
    const [username, setUsername] = useState("");
    const { queryObject } = useQueryParams();
    const { uname } = queryObject;

    const rootId = useRef("");
    const [treeData, setTreeData] = useState({});
    const [parentName, setParentUsername] = useState("");
    const [status, setStatus] = useState({
        loading: true,
        success: false,
    });
    const handleErrors = useErrors();
    const { user } = useAuth();
    const { id: uid } = user;
    const handleSuccess = (data) => {
        if (data instanceof Array) {
            setStatus({ loading: false, success: false });
        } else {
            setStatus({ loading: false, success: true });

            const [_, userTree] = Object.entries(data)[0];
            setUsername(userTree.name);
            if (Object.keys(treeData).length === 0)
                rootId.current = userTree.id;
            setTreeData(userTree);
            return userTree.parent_name;
        }
    };

    const controller = new AbortController();

    const getRoot = async (url) => {
        try {
            const { status, data } = await axiosInstance(url, {
                signal: controller.signal,
            });
            if (status === 200) return handleSuccess(data);
        } catch (err) {
            handleErrors(err);
        }
    };

    const getChildren = async (url, uname) => {
        const reqData = new FormData();
        reqData.append("username", uname);
        let URI = `${url}-children`;
        try {
            const { status, data } = await axiosInstance.post(URI, reqData);
            if (status === 200) return handleSuccess(data);
        } catch (err) {
            handleErrors(err);
        }
    };

    const fetchData = async (uname) => {
        return await (uname ? getChildren(url, uname) : getRoot(url));
    };

    const onNodeClick = async (node) => {
        const parentName = await fetchData(node.name);
        setParentUsername(parentName);
    };

    const goBack = async () => {
        const name = await fetchData(parentName);
        setParentUsername(name);
    };

    const onSearch = async (username) => {
        const name = await fetchData(username);
        setParentUsername(name);
    };

    useEffect(() => {
        if (uid) {
            fetchData(uname || null);
        }
        return () => controller.abort();
    }, [uid, uname]);

    return {
        status,
        parentName,
        onSearch,
        treeData,
        fetchTreeData: fetchData,
        username,
        onNodeClick,
        goBack,
    };
};

export default useGetTree;
