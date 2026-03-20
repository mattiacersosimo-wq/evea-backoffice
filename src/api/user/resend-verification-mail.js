import fetchUser from "src/utils/fetchUser";

const resendVerificationMail = async () => {
  try {
    const { data } = await fetchUser("resend-email-verify");
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default resendVerificationMail;
