import fetchUser from "src/utils/fetchUser";

const resendVerificationMail = async () => {
  try {
    const { data } = await fetchUser("resend-email-verify");
    return data;
  } catch (err) {
    return err;
  }
};

export default resendVerificationMail;
