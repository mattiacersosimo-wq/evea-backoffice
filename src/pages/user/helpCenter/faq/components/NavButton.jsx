import { useParams } from "react-router";
import LeftAlignButton from "src/components/LeftAlignButton";
import { PATH_USER } from "src/routes/paths";

const NavButton = ({ to, ...rest }) => {
  const param = useParams();
  const linkTo = PATH_USER.helpCenter.faq.view(to);

  return (
    <LeftAlignButton {...rest} isActive={param.label === to} linkTo={linkTo} />
  );
};

export default NavButton;
