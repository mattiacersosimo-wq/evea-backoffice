import { useState } from "react";
import visitorServer from "src/utils/visitor";

const useResendMail = (id) => {
  const [otpSend, setOtpSend] = useState(null);
  const resendMail = async () => {
    const reqData = new FormData();
    reqData.append("id", id);
    try {
      const { data } = await visitorServer.post("resend-email", reqData);
      setOtpSend("success");
    } catch (err) {
      setOtpSend("failed");
    }
  };

  return { resendMail, otpSend };
};

export default useResendMail;
