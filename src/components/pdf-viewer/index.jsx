import { capitalCase } from "change-case";
import React from "react";
import { Navigate, useLocation, useParams } from "react-router";
import ViewSDKClient from "./ViewSDKClient";

const ViewPDF = () => {
  const { name } = useParams();

  const { state } = useLocation();
  const loadPDF = (url) => {
    const viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      viewSDKClient.previewFile(
        "pdf-div",
        capitalCase(name),
        {
          defaultViewMode: "FIT_WIDTH",
          showAnnotationTools: false,
          showLeftHandPanel: true,
          showPageControls: true,
          showDownloadPDF: false,
          showPrintPDF: false,
        },
        url
      );
    });
  };

  if (!state?.href) return <Navigate to="/" />;

  return (
    <div className="mt-28">
      <div
        style={{ height: "100vh" }}
        id="pdf-div"
        className="full-window-div border border-gray-100 h-screen"
        onDocumentLoad={loadPDF(state.href)}
      ></div>
    </div>
  );
};
export default ViewPDF;
