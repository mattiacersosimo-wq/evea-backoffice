import React from "react";
import { Link, Outlet } from "react-router-dom";

const Index = () => {
  return (
    <>
      <div>Index Emails</div>
      <ul>
        <li>
          <Link to="test">hello</Link>
        </li>
        <li>how</li>
        <li>are</li>
        <li>you</li>
      </ul>
      <Outlet />
      fdgdfg
    </>
  );
};

export default Index;
