import { ADOBE_ID } from "src/config";

const ADOBE_SDK_URL = "https://documentcloud.adobe.com/view-sdk/main.js";

/**
 * Carica lo script Adobe View SDK una sola volta, on-demand.
 * Prima veniva incluso in <script> in public/index.html → scaricato su ogni
 * pagina (~200KB) anche in login/dashboard che non lo usano. Ora viene
 * caricato solo quando serve davvero un PDF viewer.
 */
let adobeSdkPromise = null;
function loadAdobeSdk() {
  if (adobeSdkPromise) return adobeSdkPromise;
  adobeSdkPromise = new Promise((resolve, reject) => {
    if (window.AdobeDC) return resolve();
    const script = document.createElement("script");
    script.src = ADOBE_SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.AdobeDC) resolve();
      else document.addEventListener("adobe_dc_view_sdk.ready", () => resolve(), { once: true });
    };
    script.onerror = () => reject(new Error("Failed to load Adobe View SDK"));
    document.head.appendChild(script);
  });
  return adobeSdkPromise;
}

class ViewSDKClient {
  constructor() {
    this.readyPromise = loadAdobeSdk();
    this.adobeDCView = undefined;
  }
  ready() {
    return this.readyPromise;
  }
  previewFile(divId, fileName, viewerConfig, url) {
    const config = {
      clientId: ADOBE_ID, ///enter lient id here
    };
    if (divId) {
      config.divId = divId;
    }
    this.adobeDCView = new window.AdobeDC.View(config);
    const previewFilePromise = this.adobeDCView.previewFile(
      {
        content: {
          location: {
            url: url,
          },
        },
        metaData: {
          fileName: fileName,
          id: "6d07d124-ac85-43b3-a867-36930f502ac6",
        },
      },
      viewerConfig
    );
    return previewFilePromise;
  }
  previewFileUsingFilePromise(divId, filePromise, fileName) {
    this.adobeDCView = new window.AdobeDC.View({
      clientId: ADOBE_ID, //enter Client id here
      divId,
    });
    this.adobeDCView.previewFile(
      {
        content: {
          promise: filePromise,
        },
        metaData: {
          fileName: fileName,
        },
      },
      {}
    );
  }
  registerSaveApiHandler() {
    const saveApiHandler = (metaData, content, options) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const response = {
            code: window.AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
            data: {
              metaData: Object.assign(metaData, {
                updatedAt: new Date().getTime(),
              }),
            },
          };
          resolve(response);
        }, 2000);
      });
    };
    this.adobeDCView.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.SAVE_API,
      saveApiHandler,
      {}
    );
  }
  registerEventsHandler() {
    this.adobeDCView.registerCallback(
      window.AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
      (event) => {
      },
      {
        enablePDFAnalytics: true,
      }
    );
  }
}
export default ViewSDKClient;
