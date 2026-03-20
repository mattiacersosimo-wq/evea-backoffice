import { useEffect, useRef, useState } from "react";
import useAuth from "src/hooks/useAuth";
import useErrors from "src/hooks/useErrors";
import axiosInstance from "src/utils/axios";

const serializeTree = (node = {}) => {
  const { name, first_name, children, have_children, profile_pic } = node;

  return {
    name: {
      firstName: first_name,
      username: name,
      have_children: Boolean(have_children),
      profile_image: profile_pic,
    },
    children:
      children?.length > 0 ? children?.map((node) => serializeTree(node)) : [],
  };
};

const test = (node, tree) => {
  let { children } = node;
  if (children?.length > 0) {
    const clickedUserIndex = children.findIndex(
      ({ name }) => name.username === tree.name.username
    );

    if (clickedUserIndex > -1) {
      children.splice(clickedUserIndex, 1, tree);
    } else {
      children = children.map((child) => test(child, tree));
    }
    node.children = children;
  }
  return node;
};

const useGetTree = (url) => {
  const rootId = useRef("");
  const [treeData, setTreeData] = useState({});

  const [expandedUsers, setExpandedUsers] = useState([]);

  const handleExpand = (uname) => {
    setExpandedUsers((prevState) => {
      let temp = [...prevState];
      const itemIndex = temp.findIndex((item) => item === uname);
      if (itemIndex < 0) {
        temp = [...temp, uname];
      } else {
        temp.splice(itemIndex, 1);
      }

      return temp;
    });
  };

  const handleErrors = useErrors();
  const { user } = useAuth();
  const { id: uid } = user;

  const parseData = (data = {}) => {
    const [_, userTree] = Object.entries(data)[0];

    if (Object.keys(treeData).length === 0) rootId.current = userTree.id;
    return userTree;
  };

  const handleSuccess = (data, isSearch = false) => {
    const userTree = parseData(data);
    setTreeData((prevState) => {
      const temp = { ...prevState };
      if (Object.keys(temp).length > 0 && !isSearch) {
        return test(temp, serializeTree(userTree));
      }
      return serializeTree(userTree);
    });
  };

  const handleReset = async () => {
    setExpandedUsers([]);
  };

  const getRoot = async (url, isSearch) => {
    try {
      const { status, data } = await axiosInstance(url);

      if (status === 200) handleSuccess(data, isSearch);
    } catch (err) {
      handleErrors(err);
    }
  };

  const getChildren = async (url, uname, isSearch) => {
    const reqData = new FormData();
    reqData.append("username", uname);
    let URI = `${url}-children`;
    try {
      const { status, data } = await axiosInstance.post(URI, reqData);
      if (status === 200) handleSuccess(data, isSearch);
    } catch (err) {
      handleErrors(err);
    }
  };

  const fetchData = async (uname, isSearch) => {
    await (uname ? getChildren(url, uname, isSearch) : getRoot(url));
  };

  const onSearch = async (uname, isSearch = false) => {
    uname ? getChildren(url, uname, isSearch) : getRoot(url, isSearch);
  };

  useEffect(() => {
    if (uid) fetchData();
  }, [uid]);
  return {
    onSearch,
    treeData,
    handleExpand,
    expandedUsers,
    handleReset,
  };
};

export default useGetTree;
