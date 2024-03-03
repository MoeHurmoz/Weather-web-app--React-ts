import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarOrigin,
} from "../../imports/MUI-Imports";
import { useUrlInfo } from "../../contexts/UrlInfoContext";

// ===== [ INTERFACE DECLARATION ] ===== //
interface SnackbarAlertProps {
  open: boolean;
  close: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  severity: string;
  duration: number;
}

export default function SnackbarAlert({
  open,
  close,
  message,
  severity = "info",
  duration,
}: SnackbarAlertProps) {
  const { urlInfo } = useUrlInfo();

  const position: SnackbarOrigin = {
    vertical: "top",
    horizontal: "center",
  };

  return (
    <Snackbar
      open={open}
      onClose={close}
      onClick={() => close()}
      autoHideDuration={duration}
      anchorOrigin={position}
      dir={urlInfo!.lang === "ar" ? "rtl" : "ltr"}
    >
      <Alert
        onClick={() => close()}
        severity={severity as AlertColor}
        variant="filled"
        sx={{ width: "100%" }}
        icon={false}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
