import { createContext, useContext, useState } from "../imports/React-Imports";
import SnackbarAlert from "../components/alerts/SnackbarAlert";

// ===== [ INTERFACE DECLARATIONS ] ===== //
interface SnackbarProviderProps {
  children: React.ReactNode;
}

export interface ShowSnackbarAlertProps {
  message: string;
  severity?: string;
  duration: number;
}

interface ShowSnackbarAlertFunc {
  showSnackbarAlert?: (config: ShowSnackbarAlertProps) => void;
}

// ===== [ CONTEXT ] ===== //
const SnackbarContext = createContext<ShowSnackbarAlertFunc>({});

// CUSTOM HOOK:
export const useSnackbar = () => useContext(SnackbarContext);

// PROVIDER COMPONENT:
export function SnackbarProvider({ children }: SnackbarProviderProps) {
  // ===== [ STATE ] ===== //
  const [snackbarAlert, setSnackbarAlert] = useState({
    open: false,
    message: "",
    severity: "success",
    duration: 0,
  });

  // ===== [ SNACKBAR ALERT HANDLERS ] ===== //
  const showSnackbarAlert = ({
    message,
    severity = "success",
    duration,
  }: ShowSnackbarAlertProps): void => {
    setSnackbarAlert({ open: true, message, severity, duration });
  };

  const closeSnackbarAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ): void => {
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
