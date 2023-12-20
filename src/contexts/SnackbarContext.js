import { createContext, useContext, useState } from "../imports/React-Imports";
import SnackbarAlert from "../components/alerts/SnackbarAlert";

const SnackbarContext = createContext({});

// CUSTOM HOOK:
export const useSnackbar = () => useContext(SnackbarContext);

// PROVIDER COMPONENT:
export function SnackbarProvider({ children }) {
  const [snackbarAlert, setSnackbarAlert] = useState({
    open: false,
    message: null,
    severity: null,
    duration: null,
  });

  const showSnackbarAlert = ({
    message = "No Message",
    severity = "success",
    duration,
  }) => {
    setSnackbarAlert({ open: true, message, severity, duration });
  };

  const closeSnackbarAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarAlert((latestState) => ({ ...latestState, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbarAlert }}>
      <SnackbarAlert
        open={snackbarAlert.open}
        close={closeSnackbarAlert}
        message={snackbarAlert.message}
        severity={snackbarAlert.severity}
        duration={snackbarAlert.duration}
      />
      {children}
    </SnackbarContext.Provider>
  );
}
