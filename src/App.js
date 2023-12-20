import "./styles/App.css";
import { createTheme, ThemeProvider } from "./imports/MUI-Imports";
import { UrlInfoProvider } from "./contexts/UrlInfoContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import MainContent from "./components/MainContent";

const theme = createTheme({
  typography: {
    fontFamily: "IBM",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UrlInfoProvider>
          <SnackbarProvider>
            <MainContent />
          </SnackbarProvider>
        </UrlInfoProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
