import { RHFEditor } from "src/components/hook-form";
import LabelStyle from "../../../../../../../../../components/label-style";
import { useTranslation } from "react-i18next";

const Description = () => {
  const { t } = useTranslation();
  return (
    <>
      <LabelStyle>{t("products.add.description")}</LabelStyle>
      <RHFEditor simple name="product_description" />
    </>
  );
};

export default Description;
