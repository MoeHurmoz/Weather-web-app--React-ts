import { forwardRef } from "../../imports/React-Imports";
import { MuiAlert, Snackbar } from "../../imports/MUI-Imports";
import { useUrlInfo } from "../../contexts/UrlInfoContext";
import { PropTypes } from "../../imports/Other-Imports";

const Alert = forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert
      icon={false}
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

export default function SnackbarAlert({
  open,
  close,
  message,
  severity = "info",
  duration,
}) {
  const { urlInfo } = useUrlInfo();

  const position = {
    vertical: "top",
    horizontal: "center",
  };

  return (
    <Snackbar
      open={open}
      onClose={close}
      onClick={close}
      autoHideDuration={duration}
      anchorOrigin={position}
      dir={urlInfo.lang === "ar" ? "rtl" : "ltr"}
    >
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

SnackbarAlert.prototype = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.string,
  duration: PropTypes.number,
};
