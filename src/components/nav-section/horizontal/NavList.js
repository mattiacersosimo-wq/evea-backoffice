import PropTypes from "prop-types";
import { Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
//
import { getActive } from "..";
import { NavItemRoot, NavItemSub } from "./NavItem";
import { PaperStyle } from "./style";

// ----------------------------------------------------------------------

NavListRoot.propTypes = {
  list: PropTypes.shape({
    children: PropTypes.array,
    path: PropTypes.string,
  }),
};

export function NavListRoot({ list }) {
  const menuRef = useRef(null);

  const { pathname } = useLocation();

  const active = getActive(list.path, pathname);

  const [open, setOpen] = useState(false);

  const hasChildren = list.children?.length > 0;

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (hasChildren) {
    return (
      <Suspense fallback={<>loading...</>}>
        <NavItemRoot
          open={open}
          item={list}
          active={active}
          ref={menuRef}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        />

        <PaperStyle
          open={open}
          anchorEl={menuRef.current}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
        >
          {(list.children || []).map((item) => (
            <NavListSub key={item.title} list={item} />
          ))}
        </PaperStyle>
      </Suspense>
    );
  }

  return <NavItemRoot item={list} active={active} />;
}

// ----------------------------------------------------------------------

NavListSub.propTypes = {
  list: PropTypes.shape({
    children: PropTypes.array,
    path: PropTypes.string,
  }),
};

function NavListSub({ list }) {
  const menuRef = useRef(null);

  const { pathname } = useLocation();

  const active = getActive(list.path, pathname);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const hasChildren = list.children?.length > 0;

  if (hasChildren) {
    return (
      <>
        <NavItemSub
          ref={menuRef}
          open={open}
          item={list}
          active={active}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        />

        <PaperStyle
          open={open}
          anchorEl={menuRef.current}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
        >
          {(list.children || []).map((item) => (
            <NavListSub key={item.title} list={item} />
          ))}
        </PaperStyle>
      </>
    );
  }

  return <NavItemSub item={list} active={active} />;
}
