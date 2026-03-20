import "./style.css";

const FloatingAction = () => {
  const onClick = () => {
    document.querySelector(".bpChatDisplyBox")?.classList?.toggle("active");
  };

  return (
    <>
      <div class="bpChatBtn" onClick={onClick}>
        <img
          src="/assets/chat/chatPopupIcon.webp"
          height="24px"
          width="24px"
          class="bpChatshow show"
          alt="best mlm software"
        />
      </div>
      <div class="bpChatDisplyBox">
        <div class="bpChatDisplyHeaderBox">
          <div class="bpChatfaceBox">
            <img
              src="/assets/chat/cloudmlm.webp"
              height="16px"
              width="16px"
              class="bpChatface"
              alt="best mlm software"
            />
            <div class="bpChatnameBox">
              <b>Let's Connect</b>
              <p>Follow us on social media</p>
            </div>
          </div>
          <img
            onClick={onClick}
            src="/assets/chat/chatPopupclose.webp"
            height="16px"
            width="16px"
            class="bpChatclose"
            alt="best mlm software"
          />
        </div>
        <div class="bpChatDisplyBodyBox">
          <div class="bpChatDisplyBodycomment">
            Want to stay updated on the latest trends and exclusive offers?
            Receive personalized solutions tailored just for you.
          </div>
          <div class="bpChatDisplyBodyBox">
            <div class="bpChatDisplySocialTittle">Connect with us!</div>
            <ul class="bpChatDisplyconnctSocial">
              <li>
                <a href="https://t.me/bpract" target="_blank">
                  <div class="connectBox">
                    <img
                      src="/assets/chat/telegram.webp"
                      height="24px"
                      width="24px"
                      alt="best mlm software"
                      title="Telegram"
                    />
                    <span> Telegram</span>
                  </div>
                  <span>→</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/919567728766" target="_blank">
                  <div class="connectBox">
                    <img
                      src="/assets/chat/whatsapp.webp"
                      height="24px"
                      width="24px"
                      alt="best mlm software"
                      title="Whatsapp"
                    />
                    <span> WhatsApp</span>
                  </div>
                  <span>→</span>
                </a>
              </li>
              <li>
                <a href="tel:+919567728766" target="_blank">
                  <div class="connectBox">
                    <img
                      src="/assets/chat/call.webp"
                      height="24px"
                      width="24px"
                      alt="best mlm software"
                      title="Mobile"
                    />
                    <span> Mobile</span>
                  </div>
                  <span>→</span>
                </a>
              </li>
            </ul>
            <ul class="bpChatDisplySocial">
              <li>
                <a
                  href="https://www.facebook.com/cloudmlmsoftware/"
                  target="_blank"
                >
                  <img
                    src="/assets/chat/fb.webp"
                    height="32px"
                    width="32px"
                    alt="best mlm software"
                    title="Facebook"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/cloudmlmsoftware/"
                  target="_blank"
                >
                  <img
                    src="/assets/chat/insta.webp"
                    height="32px"
                    width="32px"
                    alt="best mlm software"
                    title="Instagram"
                  />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/cloudmlmsoft" target="_blank">
                  <img
                    src="/assets/chat/twitter.webp"
                    height="32px"
                    width="32px"
                    alt="best mlm software"
                    title="Twitter"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCDBPEp0R4MdjMqNQM3sWkbw"
                  target="_blank"
                >
                  <img
                    src="/assets/chat/youtube.webp"
                    height="32px"
                    width="32px"
                    alt="best mlm software"
                    title="Youtube"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://in.linkedin.com/company/cloudmlmsoftware"
                  target="_blank"
                >
                  <img
                    src="/assets/chat/linkedin.webp"
                    height="32px"
                    width="32px"
                    alt="best mlm software"
                    title="Linkedin"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingAction;
