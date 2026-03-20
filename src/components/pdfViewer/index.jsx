import WebViewer from "@pdftron/webviewer";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

const PDFViewer = () => {
  const viewer = useRef(null);
  const { state } = useLocation();
  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        disabledElements: ["header", "toolsHeader"],
        initialDoc: state.docURI,
      },
      viewer.current
    ).then((instance) => {});
  }, [state]);

  return (
    <div>
      <div
        style={{
          height: "100vh",
        }}
        className="webviewer"
        ref={viewer}
      ></div>
    </div>
  );
};

export default PDFViewer;
