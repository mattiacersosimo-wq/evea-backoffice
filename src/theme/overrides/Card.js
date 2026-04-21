// ----------------------------------------------------------------------

export default function Card(theme) {
  return {
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          position: "relative",
          borderRadius: "12px",
          border: "1px solid #f0ece6",
          boxShadow: "0 1px 3px rgba(44, 26, 14, 0.04)",
          zIndex: 0,
          transition: "box-shadow .25s ease, transform .25s ease, border-color .25s ease",
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" },
        subheaderTypographyProps: {
          variant: "body2",
          marginTop: theme.spacing(0.5),
        },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
