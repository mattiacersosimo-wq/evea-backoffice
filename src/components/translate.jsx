import { useTranslation } from "react-i18next";

const Translate = ({ children }) => {
  const { t } = useTranslation();

  return t(children);
};

export default Translate;
