const { useSnackbar } = require("notistack");

const useErrors = () => {
  const { enqueueSnackbar } = useSnackbar();

  return (err) =>
    Object.values(err.errors).flatMap((item) =>
      enqueueSnackbar(item, { variant: "error" })
    );
};

export default useErrors;
