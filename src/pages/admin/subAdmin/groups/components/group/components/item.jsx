import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Loop from "src/components/loop";

const Item = ({ onChange, menu }) => {
  const { title, children, actions } = menu;
  const { watch } = useFormContext();

  const isActive =
    watch("menu").findIndex(({ title: name }) => name === title) > -1;

  const handleChange = (e) => {
    const { title, icon, path, placement } = menu;
    onChange({
      title,
      icon,
      path,
      placement,
      children: [],
    })(e);
  };
  const { t } = useTranslation();
  return (
    <>
      <FormControlLabel
        value={title}
        control={<Radio checked={isActive} onClick={handleChange} />}
        label={t(title)}
      />

      <Box
        sx={{
          marginLeft: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Loop
          list={actions}
          render={(item) => (
            <Collapse in={isActive}>
              <Actions action={item} parent={title} grandParent={title} />
            </Collapse>
          )}
        />
        <Loop
          list={children}
          render={(item) => (
            <Collapse in={isActive}>
              <SubMenu menu={item} key={item.id} onChange={onChange} />
            </Collapse>
          )}
        />
      </Box>
    </>
  );
};

const SubMenu = ({ onChange, menu }) => {
  const { title, parent, actions } = menu;
  const { watch } = useFormContext();

  const isActive =
    watch("menu")
      .find(({ title }) => title === parent)
      ?.children?.findIndex(({ title: name }) => name === title) > -1;

  const handleChange = (e) => {
    const { title, path, parent, placement, actions } = menu;

    onChange({
      title,
      path,
      parent,
      placement,
    })(e);
  };

  const { t } = useTranslation();

  return (
    <>
      <FormControlLabel
        checked={isActive}
        onChange={handleChange}
        value={`${title}.${title}`}
        control={<Checkbox />}
        label={t(title)}
      />

      <Box
        sx={{
          marginLeft: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Loop
          list={actions}
          render={(item) => (
            <Collapse in={isActive}>
              <Actions action={item} parent={title} grandParent={parent} />
            </Collapse>
          )}
        />
      </Box>
    </>
  );
};

const Actions = ({ action, parent, grandParent }) => {
  const { watch, getValues, setValue } = useFormContext();
  const menu = watch("menu");
  const isActive =
    parent !== grandParent
      ? menu
          .find(({ title }) => title === grandParent)
          ?.children?.find(({ title }) => title === parent)
          ?.actions?.includes(action) || false
      : menu
          .find(({ title }) => title === grandParent)
          ?.actions?.includes(action) || false;

  const onChange = () => {
    const menu = [...getValues("menu")];
    if (parent !== grandParent) {
      const gp = menu.find(({ title }) => title === grandParent);
      const p = gp?.children.find(({ title }) => title === parent);
      const actions = p.actions || [];

      const update = (p) => {
        const parentIndex = gp?.children.findIndex(
          ({ title }) => title === parent
        );

        gp.children.splice(parentIndex, 1, p);
        const gpIndex = menu.findIndex(({ title }) => title === grandParent);
        const tempMenu = [...menu];

        tempMenu.splice(gpIndex, 1, gp);
        tempMenu.sort((a, b) => a.placement > b.placement);
        setValue("menu", tempMenu);
      };

      const actionIndex = actions.findIndex((item) => item === action);
      if (actionIndex < 0) {
        const temp = [...(p?.actions || [])];
        p.actions = [...temp, action];
        update(p);
      } else {
        const temp = [...(p?.actions || [])];
        temp.splice(actionIndex, 1);
        p.actions = temp;
        update(p);
      }
      return;
    }
    const p = menu.find(({ title }) => title === grandParent);
    const actions = p.actions || [];
    const actionIndex = actions.findIndex((item) => item === action);
    const tempMenu = [...menu];
    const parentIndex = tempMenu.findIndex(({ title }) => title === parent);

    if (actionIndex < 0) {
      p.actions = [...(actions || []), action];
      tempMenu.splice(parentIndex, 1, p);
      setValue("menu", tempMenu);
    } else {
      const tempParent = { ...p };
      const tempActions = [...actions];
      tempActions.splice(actionIndex, 1);
      tempParent.actions = tempActions;
      tempMenu.splice(parentIndex, 1, tempParent);
      setValue("menu", tempMenu);
    }
  };

  return (
    <FormControlLabel
      checked={isActive}
      onChange={onChange}
      value={action}
      control={<Checkbox />}
      label={capitalCase(action)}
    />
  );
};

export default Item;
