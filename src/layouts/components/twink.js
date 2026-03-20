import React, { useEffect } from "react";
import TawkTo from "tawkto-react";
import { TAWK_PROPERTY_ID, TAWK_ID } from "src/config";

const Twink = () => {
  const propertyId = TAWK_PROPERTY_ID;
  const tawkId = TAWK_ID;

  useEffect(() => {
    const tawkInstance = new TawkTo(propertyId, tawkId);
    tawkInstance.hideWidget();
    tawkInstance.onStatusChange((status) => {
      console.log("Tawk.to status:", status);
    });

    // Clean up
    return () => {
      tawkInstance.showWidget();
    };
  }, [propertyId, tawkId]);

  return <div />;
};

export default Twink;
